const { projects, clients } = require('../schema/sampleData');
const Project = require('../models/Project')
const Client = require('../models/Client')

const { GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLEnumType,
    GraphQLNonNull
} = require('graphql');

// Client type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {

                return Project.findById(parent.clientId)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        clients: {
            type: new GraphQLList(ClientType),
            resolve() {
                return Client.find();
            }
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id);
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve() {
                return Project.find();
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id);
            }
        }
    }
});
const ProjectStatusEnum = new GraphQLEnumType({
    name: 'ProjectStatus',
    values: {
        NOT_STARTED: { value: 'Not Started' },
        IN_PROGRESS: { value: 'In Progress' },
        COMPLETED: { value: 'Completed' }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
            },

            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,

                })
                return client.save()
            }

        },
        //delete client
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                try {
                    const deletedClient = await Client.findByIdAndDelete(args.id);
                    if (!deletedClient) {
                        throw new Error('Client not found');
                    }
                    return deletedClient;
                } catch (err) {
                    throw new Error(`Error deleting client: ${err.message}`);
                }
            }
        },
        //add project


        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: { type: GraphQLNonNull(ProjectStatusEnum) }
                // clientId: { type: GraphQLNonNull(GraphQLID) },
            },
            

            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status
                });
                return project.save();
            },
           
        },
        //delete project
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLID }
            },
            async resolve(parent, args) {
                try {
                    const deletedProject = await Project.findByIdAndDelete(args.id);
                    if (!deletedProject) {
                        throw new Error('Client not found');
                    }
                    return deletedProject;
                } catch (err) {
                    throw new Error(`Error deleting client: ${err.message}`);
                }
            },
          
            
        },
  // update project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name:  { type: GraphQLString },
                description:  { type: GraphQLString },
                status: { type: GraphQLNonNull(ProjectStatusEnum) }
            },
            resolve(parent, args){
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status,
                        }
                    },
                    { new: true }
                )

            }


        }

    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});