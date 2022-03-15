export function constructMessageForFacilityAssignment(assignmentDetails: any) {
  let message = '';
  message +=
    assignmentDetails?.additions?.length > 0
      ? `Naomba kuongezewa fomu zifuatazo kwenye kituo: ${assignmentDetails?.organisationUnit?.name} \n` +
        assignmentDetails?.additions
          .map((addition, index) => {
            return index + 1 + '. ' + addition?.name;
          })
          .join(',\n')
      : '';

  message +=
    assignmentDetails?.deletions?.length > 0
      ? `\n\nNaomba kuondolewa fomu ya zifuatazo kwenye kituo: ${assignmentDetails?.organisationUnit?.name} \n` +
        assignmentDetails?.deletions
          .map((deletion, index) => {
            return index + 1 + '. ' + deletion?.name;
          })
          .join(',\n')
      : '';
  return { subject: 'MAOMBI YA FOMU', message };
}

export function getDataStoreDetailsForFormRequests(assignmentDetails) {
  let action = '';
  action +=
    assignmentDetails?.deletions?.length > 0
      ? 'Remove ' +
        assignmentDetails?.deletions?.length +
        ' datasets from ' +
        assignmentDetails?.organisationUnit?.name
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
        assignmentDetails?.organisationUnit?.name
      : '';
  return {
    action: action,
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
    status: 'OPEN',
    url: `organisationUnits/${assignmentDetails?.organisationUnit?.id}/dataSets.json`,
  };
}
