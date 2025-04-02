"use client";
// next
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// components
import PricingCard from "./PricingCard";

// redux
import { useAppDispatch, useAppSelector } from "@/store/hooks/hooks";
import { createCheckoutSession } from "@/store/features/paymentSlice";

// icons
import { GrClose } from "react-icons/gr";
import { clearError } from "@/store/features/paymentSlice";

export default function PricingBox() {
  const pricings = [
    {
      id: 1,
      month: "1 month",
      price: "€29.95",
    },
    {
      id: 2,
      month: "2 month",
      price: "€19.95",
    },
    {
      id: 3,
      month: "3 month",
      price: "€16.95",
    },
  ];

  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState<number>(2);
  const [referralCode, setReferralCode] = useState<string>("");

  const handleSelect = (id: number) => {
    setSelectedOption(id);
  };

  const dispatch = useAppDispatch();

  const { token } = useAppSelector((state) => state.auth);
  const { error, loading } = useAppSelector((state) => state.payment);

  const handleCheckout = async () => {
    if (!token) {
      // alert("Please log in first!");
      // router.push("/login");
      router.push("/signup");
      return;
    }
    try {
      const result = await dispatch(
        createCheckoutSession({
          token,
          interval: selectedOption,
          referralCode,
        } as { token: string; interval: number; referralCode: string })
      );

      if (createCheckoutSession.fulfilled.match(result)) {
        router.push(result.payload.url);
      } else if (createCheckoutSession.rejected.match(result)) {
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="flex items-center justify-center py-[50px] px-2 bg-[#FFF7F5]">
      <div className="w-full md:w-[600px] bg-white shadow rounded-[20px] p-4 md:p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-[16px] leading-[24px] text-[#2F2F2F] mb-8">
            Sign up to be the first to receive matches.
          </h3>
          <div className="w-full">
            <div className="flex flex-col items-center justify-center gap-4">
              {pricings.map((pricing) => (
                <PricingCard
                  key={pricing.id}
                  {...pricing}
                  handleSelect={handleSelect}
                  selectedOption={selectedOption}
                />
              ))}
            </div>
            <div className="my-8">
              <input
                className="flex items-center justify-between bg-[#F8F8F8] rounded-[10px] border p-3 outline-none w-full"
                type="text"
                placeholder="Referral Code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
            </div>
            {error && (
              <div className="flex items-center justify-center w-full bg-[#FAD1D5] relative border border-[#F45D48] py-4 mb-6 px-8 rounded-lg">
                <span className="flex items-center justify-center text-center">
                  {error || "An unexpected error occurred."}
                </span>
                <button onClick={handleClearError} className="absolute right-4">
                  <GrClose size={20} />
                </button>
              </div>
            )}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="flex items-center justify-center gap-3 bg-main group rounded-lg font-semibold mb-8 text-[14px] leading-[24px] border border-main text-white py-3 w-full xl:hover:bg-transparent xl:hover:text-main transition-all duration-300"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <span>
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="stroke-white group-hover:stroke-main"
                        d="M10.0626 18.2084C14.5615 18.2084 18.2084 14.5615 18.2084 10.0626C18.2084 5.56369 14.5615 1.91675 10.0626 1.91675C5.56369 1.91675 1.91675 5.56369 1.91675 10.0626C1.91675 14.5615 5.56369 18.2084 10.0626 18.2084Z"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        className="stroke-white group-hover:stroke-main"
                        d="M12.7733 6.87269C12.4177 6.51631 11.9951 6.23368 11.53 6.04102C11.0648 5.84836 10.5662 5.74946 10.0627 5.75C9.55921 5.74946 9.06058 5.84836 8.59541 6.04102C8.13025 6.23368 7.70771 6.51631 7.35205 6.87269M15.9191 15.9189L19.9848 19.9846"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Create search query
                </>
              )}
            </button>
            <div className="text-[16px] leading-[24px]">
              <Link className="text-[#0A806C] underline" href="/">
                Try Winkwing risk-free for 14 days.
              </Link>
              <h3 className="text-[#0A806C]">
                If you are not satisfied, you will simply get your money back.
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
