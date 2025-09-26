export default function Footer() {
  const LINKS = [
    {
      header: "legal",
      links: [
        {
          name: "Terms of Service",
          link: "",
        },
        {
          name: "Privacy Policy",
          link: "",
        },
      ],
    },
    {
      header: "community",
      links: [
        {
          name: "Discord",
          link: "",
        },
      ],
    },
    {
      header: "support",
      links: [
        {
          name: "Support Chat",
          link: "",
        },
      ],
    },
    {
      header: "prism",
      links: [
        {
          name: "The future of arcade gaming",
          link: "",
        },
      ],
    },
  ];
  return (
    <div className="border-t border-white w-full bg-black/20">
      <div className="max-w-4xl mx-auto space-y-6 pb-4">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 py-8 px-4">
          {LINKS.map((item, index) => (
            <div key={index}>
              <h4 className="text-xl font-bold uppercase pb-4">
                {item.header}
              </h4>
              <div className="space-y-2">
                {item.links.map((item2, index2) => (
                  <div
                    key={index2}
                    className="text-gray-300 cursor-pointer hover:underline underline-offset-2"
                  >
                    {item2.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto h-px w-full bg-white"></div>
        <div className="text-center">
          2025 Prism Arcade. All rights reserved.
        </div>
      </div>
    </div>
  );
}
