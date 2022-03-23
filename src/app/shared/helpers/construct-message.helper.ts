export function constructMessageForFacilityAssignment(assignmentDetails: any) {
  let message = '';
  message +=
    assignmentDetails?.additions?.length > 0
      ? `Naomba kuongezewa fomu zifuatazo kwenye kituo: ${
          assignmentDetails?.organisationUnit?.name +
          ' - ' +
          assignmentDetails?.organisationUnit?.parent?.name +
          assignmentDetails?.organisationUnit?.parent?.parent?.name
            ? ', ' + assignmentDetails?.organisationUnit?.parent?.parent?.name
            : ''
        } \n` +
        assignmentDetails?.additions
          .map((addition, index) => {
            return index + 1 + '. ' + addition?.name;
          })
          .join(',\n')
      : '';

  message += assignmentDetails?.additions?.length > 0 ? '\n\n' : '';

  message +=
    assignmentDetails?.deletions?.length > 0
      ? `Naomba kuondolewa fomu zifuatazo kwenye kituo: ${
          assignmentDetails?.organisationUnit?.name +
          ' - ' +
          assignmentDetails?.organisationUnit?.parent?.name +
          assignmentDetails?.organisationUnit?.parent?.parent?.name
            ? ', ' + assignmentDetails?.organisationUnit?.parent?.parent?.name
            : ''
        } \n` +
        assignmentDetails?.deletions
          .map((deletion, index) => {
            return index + 1 + '. ' + deletion?.name;
          })
          .join(',\n')
      : '';
  return {
    subject: assignmentDetails?.ticketNumber + ' - MAOMBI YA FOMU',
    message,
  };
}

export function getDataStoreDetailsForFormRequests(assignmentDetails) {
  let action = '';
  action +=
    assignmentDetails?.deletions?.length > 0
      ? 'Remove ' +
        assignmentDetails?.deletions?.length +
        ' datasets from ' +
        assignmentDetails?.organisationUnit?.name +
        ' - ' +
        assignmentDetails?.organisationUnit?.parent?.name +
        assignmentDetails?.organisationUnit?.parent?.parent?.name
        ? ', ' + assignmentDetails?.organisationUnit?.parent?.parent?.name
        : ''
      : '';

  action +=
    assignmentDetails?.deletions?.length > 0 &&
    assignmentDetails?.additions?.length > 0
      ? ' and '
      : '';

  action +=
    assignmentDetails?.additions?.length > 0
      ? 'Assign ' +
        assignmentDetails?.additions?.length +
        ' datasets to ' +
        assignmentDetails?.organisationUnit?.name +
        ' - ' +
        assignmentDetails?.organisationUnit?.parent?.name +
        assignmentDetails?.organisationUnit?.parent?.parent?.name
        ? ', ' + assignmentDetails?.organisationUnit?.parent?.parent?.name
        : ''
      : '';

  let replyMessage = '';
  replyMessage +=
    assignmentDetails?.deletions?.length > 0
      ? 'Removed ' +
        assignmentDetails?.deletions?.length +
        ' datasets from ' +
        assignmentDetails?.organisationUnit?.name +
        ' - ' +
        assignmentDetails?.organisationUnit?.parent?.name +
        assignmentDetails?.organisationUnit?.parent?.parent?.name
        ? ', ' + assignmentDetails?.organisationUnit?.parent?.parent?.name
        : ''
      : '';

  replyMessage +=
    assignmentDetails?.deletions?.length > 0 &&
    assignmentDetails?.additions?.length > 0
      ? ' and '
      : '';

  replyMessage +=
    assignmentDetails?.additions?.length > 0
      ? 'Assigned ' +
        assignmentDetails?.additions?.length +
        ' datasets to ' +
        assignmentDetails?.organisationUnit?.name +
        ' - ' +
        assignmentDetails?.organisationUnit?.parent?.name +
        assignmentDetails?.organisationUnit?.parent?.parent?.name
        ? ', ' + assignmentDetails?.organisationUnit?.parent?.parent?.name
        : ''
      : '';

  return {
    action: action,
    replyMessage: replyMessage,
    ticketNumber: assignmentDetails?.ticketNumber,
    method: 'POST',
    payload: {
      deletions: assignmentDetails?.deletions.map((deletion) => {
        return {
          id: deletion?.id,
          name: deletion?.name,
        };
      }),
      additions: assignmentDetails?.additions.map((addition) => {
        return {
          id: addition?.id,
          name: addition?.name,
        };
      }),
    },
    url: `organisationUnits/${assignmentDetails?.organisationUnit?.id}/dataSets.json`,
  };
}
