export default function NotificationFilters({
  selected,
  setSelected,
}) {

  const filters = [
    "All",
    "Requests",
    "Sessions",
    "Chats",
  ];

  return (

    <div
      className="
      flex
      gap-3
      mb-7
      overflow-x-auto
      pb-2
      scrollbar-hide
      "
    >

      {filters.map((item) => {

        let activeStyle =
          "bg-violet-200  border border-violet-600 text-violet-600";

        if (item === "Requests") {

          activeStyle =
            "bg-blue-600 text-white";

        }

        else if (item === "Sessions") {

          activeStyle =
            "bg-violet-600 text-white";

        }

        else if (item === "Chats") {

          activeStyle =
            "bg-green-600 text-white";

        }

        return (

          <button
            key={item}
            onClick={() =>
              setSelected(item)
            }
            className={`
              flex-shrink-0
              whitespace-nowrap
              px-4
              min-[375px]:px-5
              py-2
              rounded-2xl
              text-xs
              min-[375px]:text-sm
              font-medium
              transition-all
              duration-200
              shadow-sm

              ${
                selected === item
                  ? activeStyle
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }
            `}
          >

            {item}

          </button>

        );

      })}

    </div>

  );

}