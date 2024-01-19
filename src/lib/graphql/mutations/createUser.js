// Import the gql template tag from Apollo Client
import { gql } from "@apollo/client";

// Define your GraphQL mutation
export const CREATE_USER_MUTATION = gql`
	mutation CreateUser($input: CreateUserInput!) {
		createUser(input: $input)
	}
`;
