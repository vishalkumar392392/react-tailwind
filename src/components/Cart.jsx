import CartItem from "./CartItem";

export default function Cart({ items, setCartItems }) {
  const groppedItems = {};
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    const key = item.product.id.toString() + item.size.toString();
    if (groppedItems[key]) {
      let quantity = groppedItems[key].qty + item.qty;
      if (quantity <= 5) {
        groppedItems[key].qty = groppedItems[key].qty + item.qty;
      } else {
        groppedItems[key].qty = 5;
      }
    } else {
      groppedItems[key] = { ...item };
    }
  }

  let formattedItems = Object.values(groppedItems) || [];
  const handleChange = (value) => {
    for (let item of formattedItems) {
      if (value.type === "SIZE") {
        if (item.product.id === value.product.id && item.qty === value.qty) {
          item.size = value.size;
        }
      }
      if (value.type === "QTY") {
        if (item.product.id === value.product.id && item.size === value.size) {
          item.qty = value.qty;
        }
      }
    }
    setCartItems(formattedItems);
  };
  const deletehandler = (selectedItem) => {
    const updatedItems = formattedItems.filter(
      (item) =>
        !(
          item.product.id === selectedItem.product.id &&
          item.qty === selectedItem.qty &&
          item.size === selectedItem.size
        ),
    );
    setCartItems(updatedItems);
  };
  return (
    <div className="">
      <div className="w-16 p-5 text-2xl font-bold dark:text-white">Cart</div>
      {formattedItems?.length > 0 ? (
        formattedItems.map((item, i) => {
          return (
            <CartItem
              key={item.product.id.toString() + item.qty.toString() + i}
              item={item.product}
              qty={item.qty}
              size={item.size}
              handleItemChange={handleChange}
              deletehandler={deletehandler}
            />
          );
        })
      ) : (
        <h2 className="flex-center mt-50 dark:text-white">
          "Shop your shoes and wide.."
        </h2>
      )}
    </div>
  );
}
