import GoogleMap from "../cmps/google-map";

export function About() {
    return <section className="about">
        <h1>Our Branches:</h1>
        <section className="map">
            <GoogleMap />
        </section>
    </section>
}
