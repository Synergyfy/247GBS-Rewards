import React from "react";
import Image from "next/image";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Contest from "@/public/Perkzilla/Contest.png";
import Referral from "@/public/Perkzilla/Referal_contest.png";
import Friend from "@/public/Perkzilla/refer_a_friend.png";
import Giveaway from "@/public/Perkzilla/Giveaway.png";
import Traffic from "@/public/Perkzilla/Traffic.png";
import Access from "@/public/Perkzilla/Early_access.png";
import Cashback from "@/public/Perkzilla/cashback.png";
import SocialAwareness from "@/public/Perkzilla/socialAwareness.png";
import Stamp from "@/public/Perkzilla/stamp.png";
import FormOne from "./FormOne";

const images = [
  {
    src: Referral,
    text: "Run a",
    header: "REFERRAL CONTEST",
    hoverText:
      "Imagine your users actively competing against one another to see who can grow your business the fastest!",
  },
  {
    src: Contest,
    text: "Run a",
    header: "CONTEST",
    hoverText:
      "Watch as your users complete relevant actions to growing your business for a chance at the grand prize!",
  },
  {
    src: Friend,
    text: "Get users to",
    header: "REFER A FRIEND",
    hoverText: "Easily setup a tiered referral program where users instantly unlock rewards for getting you new leads",
  },
  {
    src: Giveaway,
    text: "Run a",
    header: "GIVEAWAY",
    hoverText: "Collect new signups faster than ever before by offering exclusive incentives that don't cost you a dime",
  },
  {
    src: Traffic,
    text: "Drive more",
    header: "TRAFFIC",
    hoverText: "Award points for completing actions such as sending new visitors to your website, blog posts, top selling products and more.",
  },
  {
    src: Access,
    text: "Start a waitlist for",
    header: "EARLY ACCESS",
    hoverText: "Get users actively promoting your brand to move up in the waitlist - the best part is a virtual spot in line carries no cost to your business!",
  },
  {
    src: Cashback,
    text: "Run a",
    header: "CASHBACK",
    hoverText: "Collect new signups faster than ever before by offering exclusive incentives that don't cost you a dime",
  },
  {
    src: Stamp,
    text: "Drive more",
    header: "POINT, VALUES AND STAMP",
    hoverText: "Award points for completing actions such as sending new visitors to your website, blog posts, top selling products and more.",
  },
  {
    src: SocialAwareness,
    text: "Start a waitlist for",
    header: "SOCIAL AWARENESS",
    hoverText: "Get users actively promoting your brand to move up in the waitlist - the best part is a virtual spot in line carries no cost to your business!",
  },
];

const Perkzilla = ({ onBack }: { onBack: () => void }) => {
  const [showFormOne, setShowFormOne] = React.useState(false);

  return (
    <div className="flex flex-col space-y-8 p-6">
      {showFormOne ? (
        <FormOne onBack={() => setShowFormOne(false)} />
      ) : (
        <>
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center text-xl text-blue-600 font-bold"
          >
            <MdKeyboardArrowLeft className="mr-2 w-10 h-10" /> Back
          </button>

          {/* Grid Container */}
          <div className="grid grid-cols-3 gap-4 p-20">
            {images.map((item, index) => (
              <a
                key={index}
                onClick={() => setShowFormOne(true)}
                className="flex flex-col justify-center items-center group  p-4 rounded-xl transition duration-300 bg-white hover:bg-[#EFEFFF] cursor-pointer"
              >
                {/* Image remains visible */}
                <div className="relative w-32 h-32">
                  <Image
                    src={item.src}
                    alt={item.header}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>

                {/* Default text and header (hidden on hover) */}
                <div className="group-hover:hidden">
                  <p className="mt-2 text-gray-600">{item.text}</p>
                  <h3 className="text-lg font-bold">{item.header}</h3>
                </div>

                {/* Hover text (shown only on hover) */}
                <div className="hidden group-hover:block mt-2">
                  <p className="text-black font-normal text-sm text-center">
                    {item.hoverText}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Perkzilla;
