const API_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-ET-WEB-AM/events";

const state = {
  parties: [],
};

const partiesList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties();
  renderParties();
}
render();

/**
 * Update state with parties from API
 */
async function getParties() {
  // TODO - Call API to fetch parties
  // This is almost identical to the example code in slides;
  // we're using the response to update state
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log(json.data);
    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Handle form submission for adding a party
 * @param {Event} event
 */
async function addParty(event) {
  // This function is essentially just a wrapper around `createParty`,
  event.preventDefault();
  // TODO - Get the values from our form and pass them into `createParty`
  await createParty(
    addPartyForm.name.value,
    addPartyForm.location.value,
    new Date(addPartyForm.date.value),
    addPartyForm.description.value
  );
}

/**
 * Ask API to create a new party and rerender
 * @param {string} name name of party
 * @param {string} imageUrl url of party image
 * @param {string} description description of the party
 */
async function createParty(name, location, date, description) {
  // TODO - Make POST request to API
  // Notice the arguments being passed to `fetch`
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location, date, description}),
    });
    const json = await response.json();
    console.log("new party", json);

    if (json.error) {
      throw new Error(json.message);
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask API to update an existing party and rerender
 * NOTE: This is not currently used in the app, but it's here for reference.
 * @param {number} id id of the party to update
 * @param {string} name new name of party
 * @param {string} imageUrl new url of party image
 * @param {string} description new description for party
 */
async function updateParty(id, name, imageUrl, description) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, imageUrl, description }),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask API to delete a party and rerender
 * @param {number} id id of party to delete
 */
async function deleteParty(id) {
  // TODO - make DELETE request to API
  // the event listener is attached to a rendered button
  // so that the correct recipe is deleted.
  try {
    console.log(id);
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Party could not be deleted.");
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Render parties from state
 */
function renderParties() {
  if (!state.parties.length) {
    partiesList.innerHTML =
      /*html*/
      `<li>No parties found.</li>`;
    return;
  }
  // This uses a combination of `createElement` and `innerHTML`;
  // we can use either one, but `createElement` is
  // more flexible and `innerHTML` is more concise.
  const partyCards = state.parties.map((party) => {
    const partyCard = document.createElement("li");
    partyCard.classList.add("party");
    partyCard.innerHTML = /*html*/ `
      <h2>${party.name}</h2>
      <p>${party.description}</p>
    `;

    // We use createElement because we need to attach an event listener.
    // If we used `innerHTML`, we'd have to use `querySelector` as well.
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    partyCard.append(deleteButton);

    // we pass in the party id to `deleteParty`
    deleteButton.addEventListener("click", () => deleteParty(party.id));

    return partyCard;
  });
  partiesList.replaceChildren(...partyCards);
}



// line 148 : <img src="${party.imageUrl}" alt="${party.name}" />