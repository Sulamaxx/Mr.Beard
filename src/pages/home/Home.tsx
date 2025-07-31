// import React, { useEffect, useState } from "react";
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./Home.scss";

// Import product images and other assets
import beardOilBottle from "/src/assets/images/home/beard-oil-bottle.png";
import reviewers from "/src/assets/images/home/reviewers.png";
import offer25 from "/src/assets/images/home/offer25.png";
import ourJourneyImage1 from "/src/assets/images/home/our-journey-image1.png";
import ourJourneyImage2 from "/src/assets/images/home/our-journey-image2.webp";
import flags from "/src/assets/images/home/flags.png";

// import g1 from "/src/assets/images/home/gallery/g1.webp";
// import g2 from "/src/assets/images/home/gallery/g2.webp";
// import g3 from "/src/assets/images/home/gallery/g3.webp";
// import g4 from "/src/assets/images/home/gallery/g4.webp";
// import g5 from "/src/assets/images/home/gallery/g5.webp";
// import g6 from "/src/assets/images/home/gallery/g6.webp";

import t1 from "/src/assets/images/home/testimonials/t1.webp";
import t2 from "/src/assets/images/home/testimonials/t2.webp";
import t3 from "/src/assets/images/home/testimonials/t3.webp";
import t4 from "/src/assets/images/home/testimonials/t4.webp";
import t5 from "/src/assets/images/home/testimonials/t5.webp";
import t6 from "/src/assets/images/home/testimonials/t6.webp";
import t7 from "/src/assets/images/home/testimonials/t7.webp";

import heroVideoMp4 from "/src/assets/images/home/hero.mp4";
import heroVideoWebm from "/src/assets/images/home/hero.webm";

import iconHighQuality from "/src/assets/icons/icon-high-quality.png";
import iconWarranty from "/src/assets/icons/icon-warranty.png";
import iconSupport from "/src/assets/icons/icon-support.png";

import featureProductsBg from "/src/assets/images/home/feature-products-background.png";
import FeaturedProducts from "../../components/ui/featuredProducts/FeaturedProducts";
// import Gallery from "../../components/ui/gallery/Gallery";
import Testimonials from "../../components/ui/testimonials/Testimonials";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  // const [galleryItems, setGalleryItems] = useState<any[]>([]);

  // In a real application, you might fetch this data from an API
  // useEffect(() => {
  //   // Gallary Image data - calculate aspect ratios from actual images
  //   const items = [
  //     {
  //       id: "1",
  //       image: g1,
  //       alt: "Man with full beard",
  //       aspectRatio: 1, // square image
  //     },
  //     {
  //       id: "2",
  //       image: g2,
  //       alt: "Man with glasses and beard",
  //       aspectRatio: 0.75, // portrait image
  //     },
  //     {
  //       id: "3",
  //       image: g3,
  //       alt: "Man with styled hair and beard",
  //       aspectRatio: 0.8, // portrait image
  //     },
  //     {
  //       id: "4",
  //       image: g4,
  //       alt: "Man with plaid shirt and beard",
  //       aspectRatio: 1.33, // landscape image
  //     },
  //     {
  //       id: "5",
  //       image: g5,
  //       alt: "Man with beard in dark lighting",
  //       aspectRatio: 0.8, // portrait image
  //     },
  //     {
  //       id: "6",
  //       image: g6,
  //       alt: "Man with hat and long beard",
  //       aspectRatio: 0.8, // portrait image
  //     },
  //   ];

  //   setGalleryItems(items);
  // }, []);

  const testimonialData = [
    {
      id: "1",
      quote:
        "ප්‍රඩක්ට් එක පට්ට කිවුවොත් මං සාදාරනයි. රැවුල වැවෙනවා කියල එක එක ජාති ඔයිල් තිබ්බත් බය නැතුව Recommend කරන්න පුලූවන් Mr. Beard Oil එක. අඩුපාඩු එක්ක වැවුන මගේ රැවුල අඩුපාඩු නැතූව වැවුනෙ Mr. Beard Oil එකෙන්. ස්තූතියි Mr. Beard",
      author: "Kavishka Madurawala",
      image: t1,
    },
    {
      id: "2",
      quote:
        "ලංකාවේ රැවුලට ආදරේ කරන කොල්ලෙක්ට ගන්න තියෙන සුපිරිම වගේම විශ්වාස කරන්න පුලූවන් සුපිරිම ප්‍රඩක්ට් එකක් මේක. සුදු වෙලා තබ වෙලා තිබ්බ මගේ රැවුල ගොඩගත්තේ මේ ප්‍රඩක්ට් එකෙන්. බය නැතුව ඕනෙම කෙනෙක්ට ගන්න Recommend කරන්න පුලූවන් සුපිරිම Beard Oil එක තමා Mr. Beard Oil එක කියන්නේ.",
      author: "Sachin Dilsara",
      image: t2,
    },

    {
      id: "3",
      quote:
        "ඇත්තම කියනවා නම් මන් අවුරුදු 18 ඉදන් යුස් කරා එක එක BEARD ඕයිල් එකක්වත් හරි ගියේ නෑ සල්ලි නිකන් නාස්ති වුණා විතරයි ඊට පස්සේ තමා MR. BEARD මට සෙට් උනේ මං මේක යූස් කරේ ෂුවර් එකෙන් නෙමෙයි හැබැයි ඇත්තම කියනවනම් මේකෙන් හිතුවට වඩා ප්‍රතිඵල තියෙනවා ඉතින් මට හම්බුන හොඳම BEARD ඕයිල් එක MR. BEARD OIL එක තමා ඕන කෙනෙක්ට මේක මට Recommend කරන්න පුළුවන්",
      author: "Madushan",
      image: t3,
    },
    {
      id: "4",
      quote:
      "මම කළිනුත් එකක් ගත්තා.. ඇත්තටම හොද බ්‍රැන්ඩ් එකක්... ලංකාවේ ප්‍රඩක්ට් එකක් විදිහට ඇත්තටම ආඩම්භරයි ඒ ගැන. අනික හොඳට කියලා දෙනවා නොදන්න දෙයක් ගැන ඇහුවම.. හරිම සුහදශීලියි.. කස්ටර්ම බැලන්ස් එක හොදටම කරනවා.. ඔයාට සහ ඔයාගේ ප්‍රඩක්ට් එකට සැමදා ජය..",
      author: "Denuwan Himesh",
      image: t4,
    },
    {
      id: "5",
      quote:
        "රැවුල තියෙන්නේ වවන්න මිසක් කපන්න නෙවේ. වැවෙන්නේ නැති එක වවා ගන්නත්, වැවෙන රැවුල මෙනෙටෙන් කරන්නත් පුළුවන් වුන එකම beard oil එක. ඊටත් එහා කස්ටමර් සර්විස් එක. රැවුලට මුල දෙන අපේ තැන. ස්තූතියි, ආදරෙයි රැවුල් මහත්තයෝ. ජය!!",
      author: "Dulaj Tharanga",
      image: t5,
    },
    {
      id: "6",
      quote:
        "Mr. Beard Store is the greatest beard care brand in Sri Lanka. The only shop where you can purchase Beard Oil, Wax and Comb with the highest nourishment for your beard. Moreover, the excellent service. I honestly hope that all of your future initiatives be successful.",
      author: "Tharaka Lakshan",
      image: t6,
    },
    {
      id: "7",
      quote:
        "පට්ට වටින වැඩක් අයියේ සරලවම කිව්වොත් ඉතින් පට්ට ගොඩක් අය මේ වැඩ ගැන වැඩි විශ්වාසයක් තියල නැ. මත් එහෙමයි. මේවගේ කිසි ප්‍රතිඵලයක් නැ. වියදම් කරන සල්ලි විතරයි කියලා මත් සැහෙන වියදම් කරල ඇති එක එක අයගෙ මේ දේවල් පාවිච්චි කරන්න. මගෙ සතුට වෙනුවෙන් සල්ලි විතරක් වියදම් උනා. මුලින්නම් හිතුවා මේකත් වියදමක් විතරක් උන කියලා, නෑ Dilshan Aiyh ඔයගේ beard oil එක ඔයා කියපු විදිහටම පවිච්චි කලා. පට්ට සතුටුයි රිසාල්ට් ගැන. දැන් නම් විශ්වාසයක් තියේ ඔයාගේ product ගැන ඒ වගේම ඒවගේ ලොකු quality තියෙනවා. තවත් ඉස්සරහටම යන්න පුලූවන් ජයවේවා.",
      author: "Nimesh Dishan",
      image: t7,
    },
    {
      id: "8",
      quote:
        "සතියෙන් දෙකෙන් වැවෙනවා කියලා ඇඩ් ගහන ඔයිල් වර්ග දෙක තුනක්ම මම පාවිච්චි කරා ඔයාලගේ එක ගාන්න කලින් හැබැයි ඒ කලින් ගාපු කිසිම එකකින් මට රිසාල්ට් එකක් නම් ආවේ නැ. ඇත්තම කිව්වොත් මම මේක ගත්තේ පට්ට අවිස්වාසයෙන් හැබැයි මට රිසාල්ට් සුපිරියටම තියෙනවා. මොකද ඔයාලා දුන්න ස්ටෙප් එකක්වත් මම අතපසු නොකර කරගත්තා. කැම්පස් එකෙත් මම ගොඩක් උන්ට ප්‍රඩක්ට් එක ගැන කිව්වා. ස්තුතියි මේ කරන දේට ඉදිරියටම කරගෙන යන්න මට තව බොතලයක් එවන්න ලබන මාසේ මුල ලැබෙන්න.",
      author: "Iresh Lakamal",
      image: t7,
    },
    {
      id: "9",
      quote:
        "Mr. Beard, මගේ ඇත්තටම රැවුල වැවුනෙම නැහැ තැනින් තැන වැවුනේ මම ගොඩක් ප්‍රඩක්ට් පාවිච්චි කරා ඒත් එවගෙන් කිසිම ප්‍රතිපලයක් තිබුනෙ නැහැ. ඊට පස්සේ මගේ වාසනාවකට Mr. Beard එකේ ඇඩ් එකක් දැකලා මට හොදයි කියලා හිතලා මම ගෙනල්ලා පාවිච්චි කරා, කියන්න සතුටුයි අද වෙද්දි 100%ක් ප්‍රතිපල තියෙනවා. ඇත්තටම ඒ ඔයිල් එක ගොඩක් වටිනා ඔයිල් එකක් ඒ ඔයිල් එකට ඉක්මනින්ම මගේ රැවුල ඉස්සර තිබ්බට වඩා වැවුනා. මම ඔයාලටත් 100% Recommend කරනවා Mr. Beard Oil එක.",
      author: "Laksahan",
      image: t7,
    },
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Video Background */}
        <video
          className="hero-video-background"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={heroVideoMp4} type="video/mp4" />
          <source src={heroVideoWebm} type="video/webm" />
          Your browser does not support the video tag.
        </video>

        {/* Video Overlay for better text readability */}
        <div className="hero-video-overlay"></div>

        <Container fluid className="p-0 align-content-center">
          <Row className="g-0">
            <Col lg={6} className="hero-content">
              <div className="px-3 px-md-5">
                <h1 className="fs-1 text-start">Natural Ingredients</h1>
                <h1 className="text-start text-primary">Beard Oil</h1>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control search-bar"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="search-addon"
                  />
                  <Button
                    className="input-group-text bg-dark border-dark text-light"
                    id="search-addon"
                  >
                    <i className="bi bi-search"></i>
                  </Button>
                </div>
                <div className="col-3 mt-3">
                  <hr className="border-3 border-white" />
                </div>
                <Row className="mt-4">
                  <Col sm={6}>
                    <div className="hero-stats">
                      <h2 className="fw-medium">#01</h2>
                      <div>
                        <Link to="/beard">
                          <Button variant="primary">
                            Start Shopping{" "}
                            <i className="bi bi-arrow-up-right"></i>
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <Row className="text-start mt-3">
                      <div>
                        <img src={reviewers} alt="reviewers" />
                      </div>
                    </Row>
                  </Col>
                  <Col
                    sm={6}
                    className="text-start text-lg-center text-xl-start ps-5"
                  >
                    <div>
                      <img src={offer25} alt="offer" />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section
        className="featured-products"
        style={{ backgroundImage: `url(${featureProductsBg})` }}
      >
        <Container fluid>
          <h2>OUR FEATURE PRODUCTS</h2>
          <Link to="/beard">
            <Button variant="dark">
              Start Shopping <i className="bi bi-arrow-up-right"></i>
            </Button>
          </Link>
          <img
            src={beardOilBottle}
            alt="beard oil"
            className="bottle-image"
            draggable="false"
          />
        </Container>
      </section>

      <section className="about-section pb-3">
        <Container fluid>
            <Row style={{maxWidth:'1100px', margin: '0 auto'}}>
              <h1 className="text-uppercase text-center text-primary text-start my-5">
                Our Journey
              </h1>
              <Col
              xl={'auto'}
              md={5}
              // md={5}
              // style={{
              //   backgroundImage: `url(${ourJourneyImage1})`,
              //   minHeight: "440px",
              //   backgroundRepeat: "no-repeat",
              //   backgroundPosition: "center",
              // }}
              >
                <img
                  src={ourJourneyImage1}
                  alt="Vision Image"
                  className="img-fluid rounded-4 product-image glow-effect"
                  width={360}
                />
              </Col>
              <Col md={7} className="align-content-start">
                <div className="beard-wax-text text-white align-content-center">
                  <Col md={12}>
                    <p className="text-start fs-5 text-center text-md-start mt-4 mt-md-3">
                      About Mr. Beard—Sri Lanka’s First Beard Care Brand 
                      Founded in 2018, Mr. Beard is Sri Lanka’s first dedicated
                      beard care brand, revolutionizing an industry that was
                      nearly nonexistent in the country at the time. Our journey
                      began when Dilshan T Amarasinghe, the founder of Mr.
                      Beard, was inspired by No Shave November, a global
                      movement supporting cancer patients. With a deep
                      commitment to men’s grooming and social responsibility,
                      Mr. Beard was born to offer high-quality beard care
                      products while making a real impact.
                    </p>
                  </Col>
                </div>
              </Col>
            </Row>
            <Row style={{maxWidth:'1100px', margin: '0 auto'}} className="mt-3">
              <Col md={6} className="align-content-center">
                <div className="beard-wax-text text-white">
                  <Col md={12}>
                    <p className="text-start fs-5 text-center text-md-start">
                      In 2022, we launched Sri Lanka’s first official No Shave
                      November campaign, continuing this initiative in 2023.
                      With every purchase of Mr. Beard Oil, a portion of the
                      proceeds goes directly to supporting cancer patients,
                      ensuring that every customer contributes to a meaningful
                      cause. At the end of each November, we donate funds to
                      hospitals dedicated to cancer treatment.
                    </p>
                  </Col>
                </div>
              </Col>
              <Col
              // md={5}
              // style={{
              //   backgroundImage: `url(${ourJourneyImage2})`,
              //   minHeight: "300px",
              //   backgroundRepeat: "no-repeat",
              //   backgroundPosition: "center",
              // }}
              >
                <img
                  src={ourJourneyImage2}
                  alt="Vision Image"
                  className="img-fluid rounded-4 product-image glow-effect"
                  // height={100}
                  width={360}
                />
              </Col>
            </Row>
            <Row style={{maxWidth:'1100px', margin: '0 auto'}} className="align-items-center justify-content-start mt-4">
              <Col md={11}>
                <p className="text-start fs-5 text-white text-center text-md-start">
                  What started as a beard care brand has now evolved into Sri
                  Lanka’s only locally developed full men’s grooming brand. Our
                  exclusive formulations are made using 100% natural
                  ingredients, specially crafted for Asian skin types, ensuring
                  the best quality and effectiveness.  <br />
                  <br />
                  Today, Mr. Beard proudly delivers premium men’s grooming
                  products to 10+ countries, including Dubai, Qatar, New
                  Zealand, Australia, Japan, Singapore, Maldives, Latvia, and
                  Korea.
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} className="vw-100"></Col>
            </Row>
            <Row>
              <img
                src={flags}
                alt="Country Flags"
                className="img-fluid mt-4"
                style={{ maxWidth: "500px", margin: "0 auto" }}
                draggable="false"
              />
            </Row>
        </Container>
      </section>

      {/* Product Carousel Section */}
      <section className="featured-products py-5">
        <h1 className="text-uppercase text-primary text-start text-center">
          Beard Oil For You
        </h1>
        <Row className="justify-content-center mt-4">
          <Col md={6}>
            <p className="text-white">
              Some of our customers say that they trust us and buy our product
              without any hesitation because they believe us and always happy to
              buy our product.
            </p>
          </Col>
        </Row>
        <FeaturedProducts />
      </section>

      {/* Benefits Section */}
      <section className="product-benefits">
        <Container>
          <Row>
            <Col md={4}>
              <div className="benefit-item">
                <Row>
                  <Col md={"auto"}>
                    <img src={iconHighQuality} alt={"iconHighQuality"}></img>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <h4 className="text-center text-md-start">
                        High Quality
                      </h4>
                    </Row>
                    <Row>
                      <span className="text-center text-md-start">
                        Crafted from top materials
                      </span>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={4} className="mt-4 mt-md-0">
              <div className="benefit-item">
                <Row>
                  <Col md={"auto"}>
                    <img src={iconWarranty} alt={"iconWarranty"}></img>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <h4 className="text-center text-md-start">
                        Warrany Protection
                      </h4>
                    </Row>
                    <Row>
                      <span className="text-center text-md-start">
                        Over 2 years
                      </span>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={4} className="mt-4 mt-md-0">
              <div className="benefit-item">
                <Row>
                  <Col md={"auto"}>
                    <img src={iconSupport} alt={"iconSupport"}></img>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <h4 className="text-center text-md-start">
                        24 / 7 Support
                      </h4>
                    </Row>
                    <Row>
                      <span className="text-center text-md-start">
                        Dedicated support
                      </span>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Gallery Section */}
      {/* <Gallery
        items={galleryItems}
        title="OUR PROUD CUSTOMERS"
        // subtitle="Get inspired by our collection of trending beard styles"
        columnCountSm={2}
        columnCountMd={3}
        columnCountLg={3}
        gapSize={10}
      /> */}

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonialData}/>
    </div>
  );
};

export default Home;
