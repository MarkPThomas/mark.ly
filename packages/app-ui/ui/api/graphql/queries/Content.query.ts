import gql from 'graphql-tag';


export const GET_IN_PROGRESS = gql`
 {
   inProgress {
     id
     type {
       key
       icon
       displayName
     }
     title
     deadlineDate
     totalItems
     completedItems
     authorToolsPath
     contentToolsPath
     statusObject {
       status
       statusDisplayName
       statusDisplayDate
       displayUpdatedDate
     }
     team {
       handle
       firstName
       lastName
       avatarUrl
       email
       persona
     }
   }
 }
`;


export const GET_PUBLISHED = gql`
 {
   Published {
     id
     type {
       key
       icon
       displayName
     }
     visible
     title
     deadlineDate
     totalItems
     completedItems
     contentToolsPath
     publishedDate
     createdDate
     statusObject {
       status
       statusDisplayName
       statusDisplayDate
       displayUpdatedDate
     }
     learnerLink
     team {
       handle
       firstName
       lastName
       avatarUrl
       email
       persona
     }
   }
 }
`;


export const GET_ALL_PUBLISHED_COURSES = gql`
 {
   AllAuthorPublishedVideoCourses {
     key
     displayName
   }
 }
`;


export const getAuthorPublishedContent = gql`
 query AllAuthorPublishedContent {
   AllAuthorPublishedContent {
     key
     type
     displayName
     hasNew
     newCount
   }
 }
`;


