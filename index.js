const { gql, ApolloServer } = require("apollo-server");
const { Neo4jGraphQL } = require("@neo4j/graphql");
const neo4j = require("neo4j-driver");
require("dotenv").config();

const schema = require('./schemas/schemas');


//LINK: https://neo4j.com/developer/js-movie-app/
// LINK: https://github.com/neo4j-examples/neo4j-movies-template
//LINK: https://neo4j.com/docs/graphql-manual/current/type-definitions/relationships/


// console.log(schema)

// const typeDefs = gql`
//   type User {
//     username: String
//     orders: [Order!]! @relationship(type: "PLACED", direction: OUT)
//   }

//   type Order {
//     orderId: ID! @id
//     created: DateTime! @timestamp(operations: [CREATE])
//     customer: User! @relationship(type: "PLACED", direction: IN)
//     products: [Product!]! @relationship(type: "CONTAINS", direction: OUT, properties: "Contains")
//   }

//   type Video {
//     title: String
//     sku: String
//   }

//   type Book {
//     title: String
//     isbn: String
//     pageCount: Int
//   }

//   union Product = Video | Book

//   interface Contains {
//       quantity: Int
//   }
// `;


const typeDefs = schema;


const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);


const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
  schema: neoSchema.schema,
});

async function getMovies() {
  const session = driver.session();

  const cypher = "MATCH (n:CMovie) RETURN n";
  const params = { name: "Adam" };

  const response = await session.run(cypher, params);
  console.log(response.records.length)

  response.records.forEach(el => console.log(el.get(0).properties))
}

async function insertMovie() {
  const session = driver.session();

  // const result = await session.run("CREATE (p:CMovie { title: $name })", { name: `Movie ${new Date().toDateString()}` });

  const result = await session.run(
    'CREATE (a:CMovie {title: $title}) RETURN a',
    { title: `Movie ${new Date().toLocaleString()}` }
  )

  const singleRecord = result.records[0]
  const node = singleRecord.get(0)

  console.log('new inserted movie', node.properties)

}


async function insertActorAndMovie() {
  const session = driver.session();

  // const result = await session.run("CREATE (p:CMovie { title: $name })", { name: `Movie ${new Date().toDateString()}` });

  const query = `CREATE p = (CActor {name:'Andy'})-[:ACTED_IN]->({title:'filmu 1'})<-[:ACTED_IN]-(CActor {name: 'Michael'})
  RETURN p`
  const result = await session.run(
    query
  )

  const singleRecord = result.records[0]
  const node = singleRecord.get(0)

  console.log('new inserted movie', node.properties)

}



server.listen().then(({ url }) => {
  console.log(`GraphQL server ready on ${url}`);

  // insertMovie();

  // insertActorAndMovie();
  getMovies()
});
