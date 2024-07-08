export const cognitoUserPool = "us-east-1_Zjn8biPdx"

export const cognitoAppClient = "hobfr7l22dpek04qvj53pvuhv"

export const cognitoRedirectUri = process.env.environment === "production" ? "https%3A%2F%2Fdal-vacation-home-sdp-23.netlify.app%2Fsecurity-questions" : "http://localhost:3000/security-questions"

export const cognitoDomainName = "dal-vacation-home-sdp23"