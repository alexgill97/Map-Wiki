const createListElement = (mapList) =>{

const listMarkup = `
<form>
  <a href=''>${mapItem.title}</a>
<form>
`;
return list.map(mapItem => {
  return listMarkup
})
};

const renderList = (mapList) => {
  $("#map-list").empty();
  return $("#map-list").append(createListElement(mapList));
}
