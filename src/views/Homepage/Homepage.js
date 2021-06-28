import React, {useState} from "react";
import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HorizontalCarousel from "./HorizontalCarousel";

export const Homepage = () => {
  const [index, setIndex] = useState(0);
  const sampleArray = [
    {
      title: " Course title 1",
      desc: "Course description"
    },
    {
      title: " Course title 2",
      desc: "Course description 2"
    }, {
      title: " Course title 3",
      desc: "Course description 3"
    },
    {
      title: " Course title 4",
      desc: "Course description 4"
    }
  ]
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  return (
    <Container>
      <Row>
        <Col/>
        <Col xs={6}>
          <Carousel activeIndex={index} onSelect={handleSelect}>
            {
              sampleArray.map((item, i) => {
                return (<Carousel.Item key={i} >
                  <img
                    className="w-100 h-100"
                    src='https://www.apple.com/v/education/home/f/images/overview/college_students__dvn47171w282_medium_2x.jpg'
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3 style={{color: 'white'}}>{item.title}</h3>
                    <p style={{color: 'white'}}>{item.desc}</p>
                  </Carousel.Caption>
                </Carousel.Item>)
              })
            }
          </Carousel>
        </Col>
        <Col/>
      </Row>
      <HorizontalCarousel deviceType={"desktop"} />

    </Container>
  );
}