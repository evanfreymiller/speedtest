import React from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";

import { faPlug } from "@fortawesome/free-solid-svg-icons";
import Test from "./components/Test";
import "./App.css";
import axios from "axios";

const { Header, Footer, Content } = Layout;

function App() {
  const [height, setHeight] = React.useState(window.innerHeight - 150);
  const [loading, setLoading] = React.useState(false);
  const inline = {
    zones: {
      height: height,
      flexWrap: "wrap",
    },
  };
  const [enabled, setEnabled] = React.useState(false);
  React.useLayoutEffect(() => {
    axios
      .get("/api/speed/status")
      .then((response) => {
        setEnabled(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const start = () => {
    setLoading(true);
    axios
      .get("/api/speed/start")
      .then((response) => {
        setEnabled(true);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const stop = () => {
    setLoading(true);
    axios
      .get("/api/speed/stop")
      .then((response) => {
        setEnabled(false);
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  return (
    <Layout>
      <Header>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon color="white" icon={faPlug} />
          <div style={{ color: "white", fontWeight: 900, marginLeft: 10 }}>
            Need For Speed
          </div>
          <div style={{ flexGrow: 1 }} />
          {enabled ? (
            <Button
              loading={loading}
              onClick={stop}
              type="primary"
              danger
              size="middle"
            >
              Stop Tests
            </Button>
          ) : (
            <Button
              loading={loading}
              onClick={start}
              type="primary"
              size="middle"
            >
              Start Tests
            </Button>
          )}
        </div>
      </Header>
      <Layout>
        <Content>
          <div className="container" style={inline.zones}>
            <Test />
          </div>
        </Content>
      </Layout>
      <Footer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 11,
            color: "#b4b6ba",
          }}
        >
          Canvas 23 Studios
        </div>
      </Footer>
    </Layout>
  );
}

export default App;
