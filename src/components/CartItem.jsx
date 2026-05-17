import { useState } from "react";
import { QTY, SIZES } from "../constants";
import Select from "./Select";
import { CiTrash } from "react-icons/ci";

export default function CartItem({
  item,
  qty,
  size,
  handleItemChange,
  deletehandler,
}) {
  const [updatedQuantity, setUpdatedQuantity] = useState(qty);
  const [updatedSize, setUpdatedSize] = useState(size);

  return (
    <div className="cursor-pointer py-4 hover:bg-amber-100 dark:text-white dark:hover:text-black">
      <div className="flex-center m-4 flex space-x-2">
        <img className="h-20 w-24" src={item.src} />

        <div className="flex flex-col space-y-2">
          <div className="font-bold">{item.title}</div>
          <div className="text-gray-500">{item.description}</div>
        </div>
        <div className="font-bold">{item.price}$</div>
      </div>
      <div className="ml-28 flex items-center justify-between">
        <div className="flex space-x-2">
          <Select
            defaultValue={qty}
            title={""}
            className={"w-16 p-1 pl-2"}
            options={QTY}
            setValue={(val) => {
              setUpdatedQuantity(val);
              handleItemChange({
                product: item,
                size: Number(updatedSize),
                qty: Number(val),
                type: "QTY",
              });
            }}
          />
          <Select
            defaultValue={size}
            title={""}
            className={"w-16 p-1 pl-2"}
            options={SIZES}
            setValue={(val) => {
              setUpdatedSize(val);
              handleItemChange({
                product: item,
                size: Number(val),
                qty: Number(updatedQuantity),
                type: "SIZE",
              });
            }}
          />
        </div>

        <div>
          <CiTrash
            onClick={() =>
              deletehandler({ product: item, qty: qty, size: size })
            }
            size={25}
            className="mr-2"
          />
        </div>
      </div>
    </div>
  );
}
