import Card from "./Card";

export default function NewArrivalsSection({ items, setCartItems, cartItems }) {
  const handleOnClick = (item) => {
    const items = [
      ...cartItems,
      {
        ...item,
      },
    ];
    setCartItems(items);
  };
  return (
    <div className="mt-20">
      <div className="flex-center">
        <div className="bg-[url(./assets/lines.png)] bg-center text-4xl font-extrabold dark:text-white">
          NEW ARRIVALS
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 justify-between gap-x-6 gap-y-24 md:grid-cols-2 xl:grid-cols-[repeat(3,25%)]">
        {items.map((item) => (
          <Card key={item.id} item={item} addToCart={handleOnClick} />
        ))}
      </div>
    </div>
  );
}
