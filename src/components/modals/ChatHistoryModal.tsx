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

const authUrl = `http://localhost:7000/auth/login`;

function ChatHistoryModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  //   const {dispatch} = useContext(Store)

  const login_user = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(authUrl, {
        email,
        password,
      });
      setLoading(false);
      console.log(data);
      console.log("login user");
    } catch (error) {
      setLoading(false);
      setErr("login fail");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="bg-secondary p-2 rounded-full cursor-pointer">
          <CalendarIcon height={16} width={16} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat History</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col space-y-4 items-center">
              A history of all your chats goes here
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
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ChatHistoryModal;
