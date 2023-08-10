import React from "react";
import { baseColors, darkColors, lightColors } from "../../theme/colors";
import { Flex, Box } from "../Box";
import { Link } from "../Link";
import {
  StyledFooter,
  StyledIconMobileContainer,
  StyledList,
  StyledListItem,
  StyledText,
  StyledSocialLinks,
  StyledToolsContainer,
  StyledBoder,
} from "./styles";
import { FooterProps } from "./types";
import { ThemeSwitcher } from "../ThemeSwitcher";
import LangSelector from "../LangSelector/LangSelector";
import CakePrice from "../CakePrice/CakePrice";
import { LogoWithTextIcon, ArrowForwardIcon, LogoFooter } from "../Svg";
import { Button } from "../Button";
import { Colors } from "../..";
import Default from "./index.stories";

const MenuItem: React.FC<FooterProps> = ({
  items,
  isDark,
  toggleTheme,
  currentLang,
  langs,
  setLang,
  cakePriceUsd,
  buyCakeLabel,
  ...props
}) => {
  return (
    <StyledFooter
      p={["40px 16px", null, "56px 40px 32px 40px"]}
      {...props}
      justifyContent="center"
      style={{ background: isDark ? "#101722" : "#101722" }}
    >
      <Flex flexDirection="column" width={["100%", null, "1200px;"]}>
        <StyledIconMobileContainer display={["block", null, "none"]}>
          <LogoWithTextIcon isDark width="130px" />
        </StyledIconMobileContainer>
        <Flex
          order={[2, null, 1]}
          flexDirection={["column", null, "row"]}
          justifyContent="space-between"
          alignItems="flex-start"
          mb={["42px", null, "36px"]}
        >
          <Box display={["none", null, "block"]}>
            <LogoFooter isDark width="160px" />
          </Box>
          {items?.map((item) => (
            <StyledList key={item.label}>
              <StyledListItem>{item.label}</StyledListItem>
              {item.items?.map(({ label, href, isHighlighted = false }) => (
                <StyledListItem key={label}>
                  {href ? (
                    <Link
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      // color={isHighlighted ? baseColors.warning : darkColors.text}
                      style={{ color: isHighlighted ? baseColors.warning : darkColors.text }}
                      bold={false}
                    >
                      {label}
                    </Link>
                  ) : (
                    <StyledText>{label}</StyledText>
                  )}
                </StyledListItem>
              ))}
            </StyledList>
          ))}
        </Flex>
        {/* <StyledSocialLinks order={[2]} pb={["42px", null, "32px"]} mb={["0", null, "32px"]} /> */}
        <StyledBoder order={[2]} pb={["1px", null, "1px"]} mb={["0", null, "32px"]} />
        <StyledToolsContainer order={[3]} flexDirection={["column", null, "row"]} justifyContent="space-between">
          <Flex order={[2, null, 1]} alignItems="center" style={{ color: "#fff" }}>
            {/* <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />
            <LangSelector
              currentLang={currentLang}
              langs={langs}
              setLang={setLang}
              color={darkColors.textSubtle as keyof Colors}
              dropdownPosition="top-right"
            /> */}
            Copyright © 2022 OnDefi | All Rights Reserved
          </Flex>
          <Flex order={[1, null, 2]} mb={["24px", null, "0"]} justifyContent="space-between" alignItems="center">
            <StyledSocialLinks />
          </Flex>
        </StyledToolsContainer>
      </Flex>
    </StyledFooter>
  );
};

export default MenuItem;
