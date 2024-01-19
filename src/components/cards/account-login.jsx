import React, { useState } from "react";
("use client");

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
// import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { gql, useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";

// const CREATE_USER_MUTATION = gql`
//   mutation CreateUser($input: CreateUserInput!) {
//     createUser(input: $input) {
//       // Specify the fields you want to retrieve after creating a user
//       id
//       username
//       name
//       email
//     }
//   }
// `;

const LOGIN_USER = gql`
	query LoginUser($email: String!, $password: String!) {
		getUserToken(email: $email, password: $password)
	}
`;

const FormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(2, {
		message: "Password must be at least 2 characters.",
	}),
});

function AccountLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { loading, error, data } = useQuery(LOGIN_USER, {
		variables: { email, password },
		skip: !email || !password, // Skip the query if email or password is not provided
	});

	const navigate = useNavigate();
	const form = useForm({
		resolver: zodResolver(FormSchema),
	});

	async function onSubmit(data) {
		setEmail(data.email);
		setPassword(data.password);
	}

	if (data) {
		Cookies.set("accessToken", data.getUserToken);
		return navigate("/quiz");
	}
	if (loading) return "Submitting...";
	if (error) return `Submission error! ${error.message}`;
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Login</CardTitle>
						<CardDescription>Login to take quiz.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Your Email" {...field} />
									</FormControl>
									{/* <FormDescription>
										This is your public display name.
									</FormDescription> */}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											placeholder="Your Password"
											type="password"
											{...field}
										/>
									</FormControl>
									{/* <FormDescription>
										This is your public display name.
									</FormDescription> */}
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full">
							Submit
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
}

export default AccountLogin;
