import styled from "styled-components";
import { darkColors } from "../../theme/colors";
import { Box, Flex } from "../Box";
import SocialLinks from "./Components/SocialLinks";

export const StyledFooter = styled(Flex)`
  background: ${darkColors.backgroundAlt};
`;

export const StyledList = styled.ul`
  list-style: none;
  margin-bottom: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 0px;
  }
`;

export const StyledListItem = styled.li`
  font-size: 16px;
  margin-bottom: 8px;
  text-transform: capitalize;

  &:first-child {
    color: #60C5BA;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

export const StyledIconMobileContainer = styled(Box)`
  margin-bottom: 24px;
`;

export const StyledToolsContainer = styled(Flex)`
  border-color: ${darkColors.cardBorder};
  // border-top-width: 1px;
  // border-bottom-width: 1px;
  border-style: solid;
  padding-top: 24px;
  // margin-bottom: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    border-top-width: 0;
    border-bottom-width: 0;
    padding: 0 0;
    margin-bottom: 0;
  }
`;

export const StyledSocialLinks = styled(SocialLinks)`
  display: flex;
  justify-content: right;
  svg{
    width: 20px;
    height: 20px;
    fill: #fff;
    background: #60C5BA;
    padding: 2px;
    border-radius: 5px;
  }
`;

export const StyledText = styled.span`
  color: ${darkColors.text};
`;
export const StyledBoder = styled(Flex)`
  width: 100%;
  height: 1px;
  background: ${darkColors.cardBorder};
`;
