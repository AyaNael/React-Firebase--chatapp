export default function Card({
    children,
    header,
    className = "",
    bodyClass = "",
    padded = true, // تحكم بالـ padding داخل الـ body
}) {
    return (
        <section
            className={[
                "card",
                className
            ].join(" ").trim()}
        >
            {header && <div className="card-header">{header}</div>}

            <div className={["card-body", padded ? "card-body--padded" : "", bodyClass].join(" ").trim()}>
                {children}
            </div>

        </section>
    );
}
