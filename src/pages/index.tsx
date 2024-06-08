/* eslint-disable react/no-unescaped-entities */
import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import ChatHistoryModal from "@/components/modals/ChatHistoryModal";
import axios from "axios";
import ThemeToggler from "@/components/buttons/ThemeToggle";
import { Store } from "@/context/Store";
import { useRouter } from "next/router";
import { generateRandomId } from "@/utils/generateRandomID";
import { useFetch } from "@/hooks/useFetch";

const apiUrl = `https://z94ka3s1dsuof4va.us-east-1.aws.endpoints.huggingface.cloud`;

export function Index() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const { dispatch, state } = useContext<any>(Store);
  const { userInfo } = state;

  const router = useRouter();
  const { query } = router;
  useEffect(() => {
    const { query } = router;
    if (!query.id) {
      const randomId = generateRandomId();
      router.replace({
        pathname: router.pathname,
        query: { ...query, id: randomId },
      });
    }
  }, [router]);

  const response = useFetch(
    `http://localhost:7000/message/all/?id=${query.id}`
  );

  useEffect(() => {
    if (response.data) {
      setMessages(response.data.messages);
    }
  }, [response.data]);

  console.log("response from server: ", messages);

  const send_message = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    setLoading(true);
    try {
      setMessages((prevMessages: any) => [
        ...prevMessages,
        { user_message: message, sentBy: "me" },
      ]);

      const { data: bot_data } = await axios.post(apiUrl, {
        inputs: message,
        parameters: {
          max_new_tokens: 512,
          return_full_text: false,
          clean_up_tokenization_spaces: true,
        },
      });

      const { data } = await axios.post(
        `http://localhost:7000/message/create`,
        {
          user_id: userInfo._id,
          user_message: message,
          bot_message: bot_data[0].generated_text,
          chat_id: query.id,
        }
      );

      // console.log(data);
      setLoading(false);

      setMessages((prevMessages: any) => [
        ...prevMessages,
        { bot_message: data.message.bot_message, sentBy: "bot" },
      ]);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      setErr("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Hutano | A health chatbot</title>
      </Head>
      <div className="min-h-screen bg-secondary w-full py-4 flex flex-col ">
        <div className="max-w-7xl w-full bg-primary mx-auto h-full flex flex-col flex-1 p-4 relative rounded-lg ">
          <div className="flex-1 flex flex-col">
            <div className="flex flex-row items-center justify-between space-x-4">
              <div className="heading-text font-bold text-3xl flex-1">
                Hutano
              </div>
              <ThemeToggler />
              <ChatHistoryModal />
            </div>
            <div className="flex flex-col h-full flex-1 w-full space-y-1 pb-4">
              <div className="flex-1"></div>

              {messages?.map((item: any, index: number) => (
                <>
                  {item.sentBy === "me" ? (
                    <div key={index} className={`flex max-w-md self-end `}>
                      <p
                        className={`text-sm font-medium py-1 px-2 rounded-xl bg-blue-700 text-white`}
                      >
                        {item.user_message}
                      </p>
                    </div>
                  ) : (
                    <div key={index} className={` flex max-w-md self-start`}>
                      <p
                        className={`text-sm font-medium py-1 px-2 bg-secondary  rounded-xl`}
                      >
                        {item.bot_message}
                      </p>
                    </div>
                  )}
                </>
              ))}
              {loading && (
                <div className="flex">
                  <p className="bg-secondary text-sm px-2 py-1 rounded-xl">
                    loading...
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex bg-secondary rounded-full px-4 bottom-0">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-secondary py-2 px-4 flex-1 outline-none rounded-full"
              placeholder="Enter message"
            />
            <button
              onClick={loading ? () => console.log("loading...") : send_message}
            >
              <PaperAirplaneIcon height={16} width={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
