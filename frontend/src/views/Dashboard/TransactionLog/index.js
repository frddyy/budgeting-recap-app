// Chakra imports
import {
  Flex,
  Grid,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React from "react";
import Recap from "./Recap";
import Report from "./Report";

// Main component
function Tables() {
  return (
    <Flex
      direction="column"
      pt={{ base: "120px", md: "75px" }}
      align="center"
      w="100%"
    >
      <Grid templateColumns="1fr" w="100%">
        {" "}
        {/* Adjust to single column */}
        <Tabs variant="soft-rounded" colorScheme="teal" isFitted w="100%">
          {" "}
          {/* Full width */}
          <TabList>
            <Tab>Recap</Tab>
            <Tab>Report</Tab>
          </TabList>
          <TabPanels w="100%">
            {" "}
            {/* Full width for Tab Panels */}
            <TabPanel>
              <Recap title={"Transaction Recap based on Period Range"} />
            </TabPanel>
            <TabPanel>
              <Report title={"Transaction Report based on Month"} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Grid>
    </Flex>
  );
}

export default Tables;
