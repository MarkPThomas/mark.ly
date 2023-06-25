import gql from 'graphql-tag';

export const CONTENT_ITEM_VISIBILITY = gql`
 mutation setContentVisibility($contentId: String) {
   setContentVisibility(contentId: $contentId) {
     visible
     contentId
   }
 }
`;


