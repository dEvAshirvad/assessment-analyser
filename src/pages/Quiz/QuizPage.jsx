import { Button } from "@/components/ui/button";
import { gql, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Router, redirect, useNavigate } from "react-router-dom";

function QuizPage() {
	const navigate = useNavigate();

	const GET_10_MCQ = gql`
		query {
			get10MCQ {
				correctAnswer
				options
				question
				subject
				topic
			}
		}
	`;

	const UserSchema = gql`
		query Query {
			getCurrentLoggedInUser {
				email
				name
				username
			}
		}
	`;
	const { loading, error, data } = useQuery(GET_10_MCQ);
	const userQuery = useQuery(UserSchema);

	const [result, setResult] = useState(null);
	const [mcqs, setMcqs] = useState([]);
	const [mcqIndex, setMcqIndex] = useState(0);
	const [mcq, setMcq] = useState(mcqs[mcqIndex]);

	async function handleEvent(event_type) {
		if ("submit" === event_type) {
			return await courseAnalyser();
		}
		if ("next" === event_type) {
			return setMcqIndex(
				mcqs.length - 1 === mcqIndex ? mcqIndex : mcqIndex + 1
			);
		}
	}

	async function courseAnalyser() {
		console.log("calculating...");
		const analysis = {
			count: 0,
			subjects: {
				physics: 0,
				chemistry: 0,
				mathematics: 0,
			},
			attempted: 0,
			attemptedTopics: [],
			correct: 0,
			correctTopics: [],
			unattempted: 0,
			unattemptedTopics: [],
			incorrect: 0,
			incorrectTopics: [],
		};

		mcqs.map((e, i) => {
			if (e.correctAnswer === e?.optionSelected) {
				analysis.count += 4;
				analysis.subjects[e.subject.toLowerCase()] += 1;

				if (!analysis.attemptedTopics.includes(`${e.topic}-${i}`)) {
					analysis.attemptedTopics.push(`${e.topic}-${i}`);
					analysis.attempted += 1;
				}

				if (!analysis.correctTopics.includes(`${e.topic}-${i}`)) {
					analysis.correctTopics.push(`${e.topic}-${i}`);
					analysis.correct += 1;
				}

				if (analysis.unattemptedTopics.includes(`${e.topic}-${i}`)) {
					analysis.unattemptedTopics = analysis.unattemptedTopics.filter(
						(el) => `${e.topic}-${i}` !== `${el}-${i}`
					);
					analysis.unattempted -= 1;
				}

				if (analysis.incorrectTopics.includes(`${e.topic}-${i}`)) {
					analysis.incorrectTopics = analysis.incorrectTopics.filter(
						(el) => `${e.topic}-${i}` !== `${el}-${i}`
					);
					analysis.incorrect -= 1;
				}
			} else if (
				"" === e?.optionSelected ||
				typeof e?.optionSelected === "undefined"
			) {
				analysis.subjects[e.subject.toLowerCase()] += 0;
				if (!analysis.unattemptedTopics.includes(`${e.topic}-${i}`)) {
					analysis.unattemptedTopics.push(`${e.topic}-${i}`);
					analysis.unattempted += 1;
				}

				if (analysis.attemptedTopics.includes(`${e.topic}-${i}`)) {
					analysis.attemptedTopics = analysis.attemptedTopics.filter(
						(el) => `${e.topic}-${i}` !== `${el}-${i}`
					);
					analysis.attempted -= 1;
				}

				if (analysis.correctTopics.includes(`${e.topic}-${i}`)) {
					analysis.correctTopics = analysis.correctTopics.filter(
						(el) => `${e.topic}-${i}` !== `${el}-${i}`
					);
					analysis.correct -= 1;
				}

				if (analysis.incorrectTopics.includes(`${e.topic}-${i}`)) {
					analysis.incorrectTopics = analysis.incorrectTopics.filter(
						(el) => `${e.topic}-${i}` !== `${el}-${i}`
					);
					analysis.incorrect -= 1;
				}
			} else {
				if (!analysis.attemptedTopics.includes(`${e.topic}-${i}`)) {
					analysis.attemptedTopics.push(`${e.topic}-${i}`);
					analysis.attempted += 1;
				}
				if (!analysis.incorrectTopics.includes(`${e.topic}-${i}`)) {
					analysis.incorrectTopics.push(`${e.topic}-${i}`);
					analysis.incorrect += 1;
				}

				analysis.subjects[e.subject.toLowerCase()] += 1;
				analysis.count -= 1;

				if (analysis.unattemptedTopics.includes(`${e.topic}-${i}`)) {
					analysis.unattemptedTopics = analysis.unattemptedTopics.filter(
						(el) => `${e.topic}-${i}` !== `${el}-${i}`
					);
					analysis.unattempted -= 1;
				}

				if (analysis.correctTopics.includes(`${e.topic}-${i}`)) {
					analysis.correctTopics = analysis.correctTopics.filter(
						(el) => `${e.topic}-${i}` !== `${el}-${i}`
					);
					analysis.correct -= 1;
				}
			}

			console.log(
				analysis.count,
				analysis.subjects[e.subject.toLowerCase()],
				e.subject.toLowerCase(),
				analysis.correctTopics,
				analysis.attemptedTopics,
				analysis.incorrectTopics,
				analysis.unattemptedTopics
			);
		});

		console.log(analysis);
		setResult(analysis);
	}

	useEffect(() => {
		console.log(!Cookies.get("accessToken"));
		if (!Cookies.get("accessToken")) {
			navigate("/");
		}
	}, []);

	useEffect(() => {
		if (data) {
			setMcqs(data?.get10MCQ);
		}

		// if (error) {
		// 	return `Error : ${error.message}`;
		// }
	}, [data, loading]);

	// useEffect(() => {
	// 	console.log(mcqs);
	// }, [mcqs]);

	useEffect(() => {
		setMcq(mcqs[mcqIndex]);
	}, [mcqIndex]);

	return (
		<main>
			{!result ? (
				mcqs.length === 0 ? (
					<section className="min-h-screen p-20 flex flex-col justify-center items-center">
						<Button onClick={() => navigate(0)}>Start Quiz</Button>
					</section>
				) : (
					<section className="min-h-screen p-20 flex flex-col justify-center">
						<div className="flex items-center justify-between mb-10">
							{Array.from({ length: mcqs.length }).map((_, index) => (
								<h1
									key={index}
									onClick={() => {
										if (index === mcqIndex) {
											return setMcqIndex(mcqIndex);
										}
										setMcqIndex(index);
									}}
									className={`w-10 aspect-square flex items-center justify-center rounded-full ring-4 cursor-pointer hover:scale-110 transition-all duration-500 ${
										mcqIndex === index
											? "bg-green-500 text-background ring-green-500 font-black scale-110"
											: "ring-foreground"
									}`}
								>
									{index + 1}
								</h1>
							))}
						</div>
						<div className="flex w-full gap-10">
							<div className="w-[70%] aspect-video bg-accent border-2 rounded-xl p-10">
								<h1 className="text-xl font-bold">
									Q. {mcqs[mcqIndex].question}
								</h1>
								<ul className="w-full mt-10 space-y-4">
									{mcqs[mcqIndex].options.map((e, i) => {
										return (
											<li
												key={i}
												onClick={() => {
													const updatedMcqs = [...mcqs];

													if (e === mcqs[mcqIndex]?.optionSelected) {
														updatedMcqs[mcqIndex] = {
															...mcqs[mcqIndex],
															optionSelected: "",
														};

														return setMcqs(updatedMcqs);
													}
													updatedMcqs[mcqIndex] = {
														...mcqs[mcqIndex],
														optionSelected: e,
													};

													return setMcqs(updatedMcqs);
												}}
												className={`p-3 px-8 border-2 rounded-lg font-semibold cursor-pointer hover:scale-[1.01] transition-all duration-300 ${
													mcqs[mcqIndex]?.optionSelected === e
														? "bg-foreground text-background scale-[1.01]"
														: ""
												}`}
											>
												{e}
											</li>
										);
									})}
								</ul>
							</div>
							<div className="w-[30%] bg-accent border-2 rounded-xl  p-10 flex flex-col justify-between">
								<ul className="space-y-2">
									<li className="flex justify-between">
										<h3>Subject</h3>{" "}
										<h3 className="font-bold">{mcqs[mcqIndex].subject}</h3>
									</li>
									<li className="flex justify-between">
										<h3>Topic</h3>{" "}
										<h3 className="font-bold">{mcqs[mcqIndex].topic}</h3>
									</li>
									<li className="flex justify-between">
										<h3>Correct Answer</h3>{" "}
										<h3 className="font-bold text-green-500">+4</h3>
									</li>
									<li className="flex justify-between">
										<h3>Wrong Answer</h3>{" "}
										<h3 className="font-bold text-red-500">-2</h3>
									</li>
									<li className="flex justify-between">
										<h3>Unattempted</h3> <h3 className="font-bold">0</h3>
									</li>
								</ul>
								<Button
									onClick={() => {
										handleEvent(
											mcqIndex === mcqs.length - 1 ? "submit" : "next"
										);
									}}
									className="w-full"
								>
									{mcqIndex === mcqs.length - 1 ? "Submit" : "Next"}
								</Button>
							</div>
						</div>
						<div className="flex justify-end mt-5">
							<Button
								variant={"destructive"}
								onClick={() => {
									Cookies.remove("accessToken");
									return navigate("/");
								}}
							>
								Logout
							</Button>
						</div>
					</section>
				)
			) : (
				<section className="min-h-screen p-20 flex flex-col justify-center">
					<div className="grid grid-cols-4 w-full gap-5">
						<div className="col-span-4 border-2 rounded-lg p-6 relative ">
							<h1 className="font-bold">User</h1>
							<ul>
								<li className="flex items-center gap-5 mt-2">
									<h3>Name : </h3>
									<h3 className="font-black">
										{userQuery.data.getCurrentLoggedInUser.name}
									</h3>
								</li>
								<li className="flex items-center gap-5">
									<h3>Email : </h3>
									<h3 className="font-black">
										{userQuery.data.getCurrentLoggedInUser.email}
									</h3>
								</li>
								<li className="flex items-center gap-5">
									<h3>Username : </h3>
									<h3 className="font-black">
										{userQuery.data.getCurrentLoggedInUser.username}
									</h3>
								</li>
							</ul>
						</div>
						<div className="aspect-[1/.5] flex justify-end items-end relative border-2 rounded-lg py-4 px-5">
							<h1 className="absolute left-5 top-4 font-bold">Count</h1>
							<h1 className="text-3xl font-black">
								{result.count} <span className="text-lg font-medium">/40</span>
							</h1>
						</div>
						<div className="aspect-[1/.5] flex justify-end items-end relative border-2 rounded-lg py-4 px-5">
							<h1 className="absolute left-5 top-4 font-bold">Physics</h1>
							<h1 className="text-3xl font-black">
								{result.subjects.physics}{" "}
								<span className="text-lg font-medium">
									/{mcqs.filter((e) => e.subject === "physics").length}
								</span>
							</h1>
						</div>
						<div className="aspect-[1/.5] flex justify-end items-end relative border-2 rounded-lg py-4 px-5">
							<h1 className="absolute left-5 top-4 font-bold">Chemistry</h1>
							<h1 className="text-3xl font-black">
								{result.subjects.chemistry}
								<span className="text-lg font-medium">
									/{mcqs.filter((e) => e.subject === "chemistry").length}
								</span>
							</h1>
						</div>
						<div className="aspect-[1/.5] flex justify-end items-end relative border-2 rounded-lg py-4 px-5">
							<h1 className="absolute left-5 top-4 font-bold">Mathematics</h1>
							<h1 className="text-3xl font-black">
								{result.subjects.mathematics}
								<span className="text-lg font-medium">
									/{mcqs.filter((e) => e.subject === "mathematics").length}
								</span>
							</h1>
						</div>
						<div className="aspect-[1/.5] flex flex-col relative border-2 rounded-lg py-4 px-5">
							<h1 className="font-bold">Attempted</h1>
							<ul className="mt-5 h-32 overflow-hidden overflow-y-scroll">
								{result.attemptedTopics.map((e, i) => {
									return (
										<li key={i} className="">
											- {e.split("-")[0]}
										</li>
									);
								})}
							</ul>
						</div>
						<div className="aspect-[1/.5] flex flex-col relative border-2 rounded-lg py-4 px-5">
							<h1 className="font-bold">Unattempted</h1>
							<ul className="mt-5 h-32 overflow-hidden overflow-y-scroll">
								{result.unattemptedTopics.map((e, i) => {
									return (
										<li key={i} className="">
											- {e.split("-")[0]}
										</li>
									);
								})}
							</ul>
						</div>
						<div className="aspect-[1/.5] flex flex-col relative border-2 rounded-lg py-4 px-5">
							<h1 className="font-bold">Correct Topics</h1>
							<ul className="mt-5 h-32 overflow-hidden overflow-y-scroll">
								{result.correctTopics.map((e, i) => {
									return (
										<li key={i} className="">
											- {e.split("-")[0]}
										</li>
									);
								})}
							</ul>
						</div>
						<div className="aspect-[1/.5] flex flex-col relative border-2 rounded-lg py-4 px-5">
							<h1 className="font-bold">Incorrect Topics</h1>
							<ul className="mt-5 h-32 overflow-hidden overflow-y-scroll">
								{result.incorrectTopics.map((e, i) => {
									return (
										<li key={i} className="">
											- {e.split("-")[0]}
										</li>
									);
								})}
							</ul>
						</div>
					</div>
					<div className="flex justify-end mt-10 gap-5">
						<Button
							variant={"destructive"}
							onClick={() => {
								Cookies.remove("accessToken");
								return navigate("/");
							}}
						>
							Logout
						</Button>
						<Button className="w-[150px] font-bold" onClick={() => navigate(0)}>
							Play Again
						</Button>
					</div>
				</section>
			)}
		</main>
	);
}

export default QuizPage;
