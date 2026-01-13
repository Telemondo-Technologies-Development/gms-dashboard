import { Bell, Search, User2 } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export default function Header() {
	// Mock user
	const user = { name: "John Does" }
	return (
		<header className="h-16 border-b flex items-center px-6 shadow-sm shadow-accent-foreground/10">
			<div className="flex items-center gap-4 w-full">
				<div className=" flex items-center gap-2">
                    <Button
						variant="ghost"
						size="sm"
						className="flex items-center gap-2 h-9 px-3 py-1 rounded-2xl "
						aria-label="Edit profile"
					>
						<User2 className="h-5 w-5 hover:text-accent-foreground" />
						<span className="text-sm font-medium hover:text-accent-foreground text-center">{user.name}</span>
					</Button>
                    <Button variant="ghost" size="icon" aria-label="Notifications" className="h-9 w-9 rounded-2xl">
						<Bell className="h-5 w-5" />
					</Button>
					<div className="relative">
						<Input
							type="text"
							placeholder="Search..."
							className="pl-9 pr-3 py-2 h-9 w-100 rounded-2xl bg-muted focus:bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
						/>
						<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
					</div>
				</div>
			</div>
		</header>
	)
}
