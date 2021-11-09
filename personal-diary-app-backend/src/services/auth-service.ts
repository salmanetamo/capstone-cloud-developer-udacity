import { createLogger } from "src/utils/logger";
import { verify, decode, JwtHeader } from 'jsonwebtoken'
import Axios from 'axios'
import { JwtPayload } from "src/auth/JwtPayload";
import { Jwt } from "src/auth/Jwt";
import { certToPEM, parseUserId } from "src/auth/utils";
import { APIGatewayProxyEventHeaders } from "aws-lambda";

const logger = createLogger('AuthenticaticationService');
const jwksUrl = process.env.JWKS_URL;

export async function verifyToken(authHeader: string): Promise<JwtPayload> {
    const token = getToken(authHeader)
    const jwt: Jwt = decode(token, { complete: true }) as Jwt

    if (!jwt.header || jwt.header.alg !== 'RS256') {
        throw new Error('JWT Header missing or wrong encryption algorithm');
    }
    const jwksSigningKeys = await getJwksSigningKeys();
    const signingKeyForHeader = getSigningKeyForHeader(jwksSigningKeys, jwt.header);

    if (!signingKeyForHeader) {
        throw new Error(`Unable to find a signing key that matches '${jwt.header.kid}'`);
    }

    return verify(token, signingKeyForHeader.publicKey, { algorithms: ['RS256'] }) as JwtPayload;
}


/**
 * Get a user id from an API Gateway event headers
 * @param headers an event from API Gateway Headers
 *
 * @returns a user id from a JWT token
 */
export function getUserId(headers: APIGatewayProxyEventHeaders): string {
    const authorization = headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    return parseUserId(jwtToken)
}

async function getJwksSigningKeys(): Promise<any[]> {
    const response = await Axios.get<{ keys: any[] }>(jwksUrl, {
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const jwks = response.data.keys;

    if (!jwks || !jwks.length) {
        logger.error('Error getting auth0 keys');
        throw new Error('The JWKS endpoint did not contain any keys');
    }

    const signingKeys = jwks
        .filter(key => key.use === 'sig'
            && key.kty === 'RSA'
            && key.kid
            && ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
        ).map(key => {
            return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
        });

    if (!signingKeys.length) {
        logger.error('Error getting auth0 keys');
        throw new Error('The JWKS endpoint did not contain any signature verification keys');
    }

    return signingKeys;
}

function getToken(authHeader: string): string {
    if (!authHeader) throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header')

    const split = authHeader.split(' ')
    const token = split[1]

    return token
}

function getSigningKeyForHeader(jwksSigningKeys: any[], header: JwtHeader) {
    return jwksSigningKeys.find(signingKey => signingKey.kid === header.kid);
}
