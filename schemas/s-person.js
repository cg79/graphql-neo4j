
const actorSchema = `
    type CPerson {
        name: String
        sku: String
        actedInMovies: [CMovie!]! @relationship(type: "ACTED_IN", direction: OUT)
    }
`;

module.exports = actorSchema