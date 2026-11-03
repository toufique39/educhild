const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=900&q=85",
    alt: "Volunteers working together for a community project",
    title: "Together We Make a Difference",
    className: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=700&q=85",
    alt: "People participating in a community volunteering activity",
    title: "Community Support",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=700&q=85",
    alt: "Volunteers helping people in need",
    title: "Helping Hands",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=700&q=85",
    alt: "Community members working together",
    title: "Stronger Together",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=85",
    alt: "Children participating in a learning activity",
    title: "Every Child Matters",
    className: "",
  },
];

export default function CommunityGallerySection() {
  return (
    <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-brand-text">
            Our Community
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl">
            Moments That Make a Difference
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Every helping hand creates a story. Explore the moments,
            connections, and positive changes happening through our
            community activities.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4 md:gap-4">
          {galleryImages.map((image, index) => (
            <figure
              key={image.title}
              className={`group relative min-h-40 overflow-hidden rounded-2xl ${image.className} ${
                index === 0 ? "min-h-[320px] md:min-h-0" : ""
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Image Caption */}
              <figcaption className="absolute bottom-0 left-0 p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-white sm:text-base">
                  {image.title}
                </h3>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}