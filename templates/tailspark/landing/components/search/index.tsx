"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

interface Props {
  query?: string;
}

export default ({ query }: Props) => {
  const router = useRouter();
  const [inputDisabled, setInputDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [content, setContent] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleInputKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && !e.shiftKey) {
      if (e.keyCode !== 229) {
        e.preventDefault();
        handleSubmit("", content);
      }
    }
  };

  const handleSubmit = async (keyword: string, question: string) => {
    try {
      const url = `?q=${encodeURIComponent(question)}`;
      console.log("query url", url);
      await router.push(url);
      setInputDisabled(true); // Disable input after navigation
    } catch (e) {
      console.log("search failed: ", e);
      setInputDisabled(false);
    }
  };

  useEffect(() => {
    if (query) {
      setContent(query);
      setInputDisabled(false);
    }
  }, [query]);

  useEffect(() => {
    const handleRouteChange = () => {
      setInputDisabled(false); // Re-enable input after route change
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <section className="relative mt-4 md:mt-8">
      <div className="mx-auto w-full max-w-2xl px-6 text-center">
        <form
          method="POST"
          action="/gpts/search"
          className="flex items-center relative"
        >
          <input
            type="text"
            className="text-sm md:text-md flex-1 px-4 py-3 border-2 border-primary bg-white rounded-lg disabled:border-gray-300 disabled:text-gray-300"
            placeholder="keyword to search"
            ref={inputRef}
            value={content}
            disabled={inputDisabled}
            onChange={handleInputChange}
            onKeyDown={handleInputKeydown}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute right-4 cursor-pointer"
            onClick={() => {
              if (content) {
                handleSubmit("", content);
              }
            }}
          >
            <polyline points="9 10 4 15 9 20"></polyline>
            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
          </svg>
        </form>
      </div>
    </section>
  );
};
