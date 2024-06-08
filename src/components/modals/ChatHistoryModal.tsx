import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useContext, useState } from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import { Store } from "@/context/Store";
import { useFetch } from "@/hooks/useFetch";
import { useRouter } from "next/router";

const authUrl = `http://localhost:7000/auth/login`;

function ChatHistoryModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { dispatch, state } = useContext<any>(Store);
  const { userInfo } = state;
  const router = useRouter();

  const response = useFetch(`http://localhost:7000/message/chats`);
  console.log("response from server: ", response);

  const login_user = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(authUrl, {
        email,
        password,
      });
      dispatch({ type: "USER_LOGIN", payload: data });
      setLoading(false);
      console.log(data);
      console.log("login user");
    } catch (error) {
      setLoading(false);
      setErr("login fail");
    }
  };

  const getNewChat = (chat_id: any) => {
    const { query } = router;
    router.replace({
      pathname: router.pathname,
      query: { ...query, id: chat_id },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="bg-secondary p-1 rounded-full cursor-pointer">
          <CalendarIcon height={16} width={16} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat History</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <div className="flex flex-col space-y-4 items-center">
            <p>A history of all your chats goes here</p>
            {userInfo ? (
              <div className="flex flex-col space-y-4 w-full">
                {response.data.message?.map((item: any) => (
                  <button
                    onClick={() => getNewChat(item.chat_id)}
                    className="main-border w-full p-2 rounded-lg"
                    key={item._id}
                  >
                    {item.user_message}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary w-full py-2 px-4 flex-1 outline-none rounded-full"
                  placeholder="email"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary py-2 w-full px-4 flex-1 outline-none rounded-full"
                  placeholder="password"
                />
                <PrimaryButton
                  onClick={login_user}
                  loading={loading}
                  text="login"
                />
              </>
            )}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default ChatHistoryModal;
