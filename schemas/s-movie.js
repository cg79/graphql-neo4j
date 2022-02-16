
const movieSchema = `
    type CMovie {
        title: String
        sku: String
        directedBy: CPerson! @relationship(type: "DIRECTED", direction: IN)
    }
`;

module.exports = movieSchema