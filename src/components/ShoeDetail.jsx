import { useState } from "react";
import nike1 from "../assets/n1-min.png";
import { QTY, SIZES } from "../constants";
import Select from "./Select";

export default function ShoeDetail({ setCartItems, cartItems }) {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(41);

  const handleOnClick = () => {
    const items = [
      ...cartItems,
      {
        product: {
          id: 1,
          src: nike1,
          className: "bg-[#EEFFA4]",
          title: "Nike Air Max 270",
          description:
            "The Nike Air Max 270 is a lifestyle shoe that's sure to turn heads with its vibrant color gradient.",
          price: 160,
        },
        qty: Number(quantity),
        size: Number(size),
      },
    ];
    setCartItems(items);
  };
  return (
    <div className="flex flex-col space-y-4 lg:flex-row-reverse dark:text-white">
      {/** Shoe Image */}
      <div className="flex-1 lg:-mt-32 lg:ml-28">
        <div className="flex-center from- h-full bg-linear-to-br from-[#F637CF] from-5% via-[#E3D876] via-40% to-[#4DD4C6]">
          <img className="animate-float" src={nike1} alt="image" />
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {/** Shoe Text */}
        <div className="text-5xl font-black md:text-9xl">Nike Air Max 270</div>
        <div className="font-medium md:text-xl">
          {
            "The Nike Air Max 270 is a lifestyle shoe that's sure to turn heads with its vibrant color gradient."
          }
        </div>
        <div className="flex flex-row space-x-2">
          <div className="text-3xl font-extrabold md:text-6xl">160 $</div>
          <Select
            setValue={(value) => setQuantity(value)}
            title={"QTY"}
            options={QTY}
            value={quantity}
          />
          <Select
            setValue={(value) => setSize(value)}
            title={"SIZE"}
            options={SIZES}
            value={quantity}
          />
        </div>
        {/** Shoe Buttons & links */}

        <div className="space-x-10">
          <button
            onClick={handleOnClick}
            className="h-14 w-44 cursor-pointer bg-black text-white hover:bg-gray-900 active:bg-gray-700"
          >
            Add to bag
          </button>
          <a
            href="#"
            className="text-lg font-bold underline underline-offset-4"
          >
            View details
          </a>
        </div>
      </div>
    </div>
  );
}
