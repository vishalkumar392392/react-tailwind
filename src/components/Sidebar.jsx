export default function Sidebar({ isOpen, onClickCart, children }) {
  return (
    <div>
      <div
        className={`dark:bg-night fixed top-0 right-0 z-50 h-full w-full transform overflow-y-auto bg-white transition duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} shadow-lg md:w-[50%] lg:w-[35%]`}
      >
        <button
          onClick={onClickCart}
          className="absolute top-4 right-4 cursor-pointer p-2 font-bold text-black dark:text-white"
        >
          X
        </button>
        {children}
      </div>
      {isOpen && (
        <div className="fixed top-0 left-0 z-20 h-full w-full bg-black opacity-50"></div>
      )}
    </div>
  );
}
