import { LogoutButton } from "@/app/shared/ui/components/LogoutButton";
import UserInfo from "@/app/shared/ui/components/UserInfo";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl gap-5 items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="bg-zinc-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Вход
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Регистрация
            </button>
          </SignUpButton>
        </Show>
        <UserInfo />
        <Show when="signed-in">
          <UserButton />
          <LogoutButton/>
        </Show>
      </main>
    </div>
  );
}
