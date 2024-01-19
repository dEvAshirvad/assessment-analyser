import React from "react";
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
import { gql, useMutation } from "@apollo/client";
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

const FormSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	email: z.string().email(),
	password: z.string().min(2, {
		message: "Password must be at least 2 characters.",
	}),
});

function AccountCreate() {
	const navigate = useNavigate();
	const form = useForm({
		resolver: zodResolver(FormSchema),
	});
	const [mutateFunction, { data, loading, error }] = useMutation(gql`
		mutation CreateUser($input: CreateUserInput!) {
			createUser(input: $input)
		}
	`);
	async function onSubmit(data) {
		mutateFunction({
			variables: {
				input: {
					// Map form data to your GraphQL input
					username: data.username,
					name: data.name,
					email: data.email,
					password: data.password,
				},
			},
		});
	}

	if (data) {
		Cookies.set("accessToken", data.createUser);
		return navigate("/quiz");
	}
	if (loading) return "Submitting...";
	if (error) return `Submission error! ${error.message}`;
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Account</CardTitle>
						<CardDescription>
							Make changes to your account here. Click save when you're done.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input placeholder="shadcn" {...field} />
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
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Your Name" {...field} />
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

export default AccountCreate;
