
const { gql } = require("apollo-server");
const movieSchema = require('./s-movie')
const actorSchema = require('./s-actor')
const personSchema = require('./s-person')

// const { buildSchema } = require('graphql');


function createSchema() {
    const schema =
        `
        ${movieSchema}
        ${actorSchema}
        ${personSchema}
    `

    console.log(schema)

    return gql(`${schema}`);
}

module.exports = createSchema()