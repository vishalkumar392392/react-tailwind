export default function Card({ item, addToCart }) {
  return (
    <div
      className={`${item.className} relative max-w-xl transform cursor-pointer transition hover:scale-105`}
    >
      <div className="p-8">
        <div className="text-2xl font-bold">{item.title}</div>
        <div
          onClick={() => addToCart({ product: item, qty: 1, size: 41 })}
          className="mt-10 font-semibold underline underline-offset-4"
        >
          SHOP NOW +
        </div>
      </div>
      <img className="absolute top-5 left-[40%] h-40 w-56" src={item.src} />
    </div>
  );
}
