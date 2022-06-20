import { useEffect, useState } from "react";
import { NavComponent } from "../../components/common/nav/nav";
import axios from 'axios';
import moment from 'moment';
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { Box } from "@mui/system";

export function HomePage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoad, setIsLoad] = useState(false);
  const [page, setPage] = useState(1);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    setIsLoad(true)
    const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/common/log`);
    const { result } = response.data;
    setLogs([...result])
    setIsLoad(false);
    setIsFirstRender(false)
  }

  const pingServer = async () => {
    setIsLoad(true);
    await axios.get(`${process.env.REACT_APP_SERVER_HOST}/common/ping`);
    loadLogs();
  }

  const onLoadMore = async () => {
    setPage(page + 1);
    setIsLoad(true)
    const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/common/log?page=${page + 1}`);
    const { result } = response.data;
    setLogs([...logs, ...result])
    setIsLoad(false);
  }

  return (
    <div>
      <Container>
        <Box>
          {
            logs.map((log: any) => {
              return (
                <div
                  style={{
                    marginTop: "8px"
                  }}
                >
                  {/* <div>
                Log ID: {log.id}
              </div> */}
                  <div>
                    Message: {log.message}
                  </div>
                  <div>
                    From: {log.from}
                  </div>
                  <div>
                    Type: {log.type}
                  </div>
                  <div>
                    Created At: {moment(log.createdAt).format("DD-MMM-YY, h:mm:ss a")} ({moment(log.createdAt).fromNow()})
                  </div>
                  <hr />
                </div>
              )
            })
          }
        </Box>
        <Box>
          <Typography
            onClick={onLoadMore}
            sx={{
              fontStyle: "italic",
              textDecoration: "underline",
              cursor: "pointer",
              marginBottom: "16px 0px 16px 0px",
              textAlign: "center"
            }}
          >
            {
              isLoad ? "Loading..." : "Load More"
            }
          </Typography>
        </Box>
        {
          !isFirstRender && (
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>

              <Button
                variant="contained"
                color="primary"
                endIcon={<ConnectWithoutContactIcon />}
                onClick={pingServer}
                sx={{
                  '@media only screen and (max-width: 690px)': {
                    width: "100%"
                  }
                }}
              >
                {
                  isLoad ? <CircularProgress size="30px" color="inherit" /> : "PING"
                }
              </Button>
            </Box>
          )
        }
      </Container>
    </div>
  );
}
