import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountCreate from "./components/cards/account-create";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AccountLogin from "./components/cards/account-login";

function App() {
	const [payload, setPayload] = useState(null);
	const navigate = useNavigate();
	useEffect(() => {
		if (Cookies.get("accessToken")) {
			return navigate("/quiz");
		}
	}, []);

	async function handleCreation() {}
	return (
		<main>
			<section className="min-h-screen flex items-center justify-center">
				<Tabs defaultValue="login" className="w-[400px]">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="create">Create Account</TabsTrigger>
						<TabsTrigger value="login">Login</TabsTrigger>
					</TabsList>
					<TabsContent value="create">
						<AccountCreate />
					</TabsContent>
					<TabsContent value="login">
						<AccountLogin />
					</TabsContent>
				</Tabs>
			</section>
		</main>
	);
}

export default App;
