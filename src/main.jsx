import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
	createBrowserRouter,
	redirect,
	Route,
	RouterProvider,
	useRouteError,
} from "react-router-dom";
import { ApolloProvider, createHttpLink, gql, useQuery } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { setContext } from "@apollo/client/link/context";

import QuizPage from "./pages/Quiz/QuizPage.jsx";
import Cookies from "js-cookie";

// const httpLink = createHttpLink({
// 	uri: "http://localhost:8080/api/v1",
// 	headers: { "x-api-key": "28093069-70b9-40c4-bd08-528978012beb" },
// });

// const authLink = setContext((_, { headers }) => {
// 	// get the authentication token from local storage if it exists
// 	// const token = localStorage.getItem('token');
// 	// return the headers to the context so httpLink can read them
// 	return {
// 		headers: {
// 			...headers,
// 			"x-api-key": "28093069-70b9-40c4-bd08-528978012beb",
// 		},
// 	};
// });

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) =>
	isAuthenticated ? <Component {...props} /> : redirect("/");

const client = new ApolloClient({
	uri: "http://localhost:8080/api/v1",
	headers: {
		"x-api-key": "28093069-70b9-40c4-bd08-528978012beb",
		Authorization: `Bearer ${Cookies.get("accessToken")}`,
	},
	cache: new InMemoryCache(),
});

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorBoundary />,
	},
	{
		path: "/quiz",
		element: <QuizPage />,
		errorElement: <ErrorBoundary />,
	},
]);

if (true) {
	// Adds messages only in a dev environment
	loadDevMessages();
	loadErrorMessages();
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<RouterProvider router={router} />
		</ApolloProvider>
	</React.StrictMode>
);

function ErrorBoundary() {
	let error = useRouteError();
	console.error(error);
	// Uncaught ReferenceError: path is not defined
	return (
		<div>
			Dang! {error.message} {error.location}
		</div>
	);
}
