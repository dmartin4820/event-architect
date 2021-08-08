const List = require('list.js');

async function updateDetails(detailInfo) {

	const response = await fetch(`/api/detail`, {
		method: 'PUT',
		body: JSON.stringify(detailInfo),
		headers: {'Content-Type':'application/json'}
	});

	if (response.ok) {
		const {event_id, detail_id} = await response.json();
		console.log(`Update detail with id ${detail_id} for event with id ${event_id}`)
	}
}

async function addDetails(detailInfo) {

}

function editListEl() {
	let options = {		
		valueNames: ['detail-id', 'event-id', 'content']
	};

	let detailList = new List('detail-list', options); //Create List object as defined in list.js. Finds the child list element

	const listEditBtns = document.getElementsByClassName('list-edit-btn'); //Grab all the edit buttons

	for (let i=0; i < listEditBtns.length; i++) { //create event listeners for all edit buttons
		listEditBtns[i].addEventListener('click', async (e) => {
			const parent = listEditBtns[i].parentElement;

			//Hide edit button and then display a submit button for changing the list element content
			listEditBtns[i].style.display = "none"; 
			const listElSubmit = document.createElement('button');
			listElSubmit.innerHTML = "submit";
			parent.appendChild(listElSubmit);

			//Use list.js to get the list item event_id
			const detail_id = Number(e.target.getAttribute('id'));
			const listItem = detailList.get('detail-id', detail_id)[0];
			const originalText = listItem.values().content;
		
			//Replace the list item with an input field for the user to specify their change
			const inputElText = `<input type=text placeholder="${listItem.values().content}" id="input-id-${detail_id}"/>`
			listItem.values({
				content: inputElText
			});

			const inputEl = document.getElementById(`input-id-${detail_id}`); //Grab the newly created input element

			//Listen for the user submit
			listElSubmit.addEventListener('click', async (e) => {
				if (inputEl.value.trim().length !== 0){
					console.log(inputEl.value.trim().length)
					listItem.values({
							content: inputEl.value.trim()
					});		
				
					const detailInfo = {
						event_id: listItem.values()["event-id"],
						detail_id: listItem.values()["detail-id"],
						content: listItem.values()["content"]
					};
					await updateDetails(detailInfo);
				} else {
					listItem.values({
						content: originalText
					});
				}

				listElSubmit.remove();
				listEditBtns[i].style.display = "inline-block";
			});
		});
	}
}

function addListEl() {
	const event_id = document.getElementById('event-title').dataset.id;

	let options = {
		valueNames: ['detail-id', 'event-id', 'content', {attr:'style', name:'list-edit-btn'}],
		item: `<li class="list-el">
							<span class="content"></span>
							<span class="detail-id" style="display: none;"></span>
							<span class="event-id" style="display: none;"></span>
							<button class="list-edit-btn" id="${event_id}" style>Edit</button>
					  </li>`
	};

	
	const detailList = new List('detail-list', options);

	const addBtn = document.getElementsByClassName('add-btn');

	addBtn[0].addEventListener('click', (e) => {
		addBtn[0].style.display = "none"
		const detail_id = detailList.items.length + 1;
		detailList.add({
			"detail-id": detail_id,
			"event-id": event_id,
			"list-edit-btn": "display: none",
			content: `<input type=text placeholder="Enter detail" id="add-input-id-${detail_id}"/>`
		});
		
		const detailItem = detailList.get('detail-id', detail_id)[0];

		const parent = addBtn[0].parentElement;

		//Display a submit button for changing the list element content
		const listElSubmit = document.createElement('button');
		listElSubmit.innerHTML = "submit";
		parent.appendChild(listElSubmit);

		listElSubmit.addEventListener('click', (e) => {
			const content = document.getElementById(`add-input-id-${detail_id}`);

			if (content.value.trim().length !== 0) {
				detailItem.values({
					content: content.value.trim(),					
					"list-edit-btn": "display: inline-block"
				});
			} else {
				detailList.remove('detail-id', detail_id)
			}

			listElSubmit.remove();
			addBtn[0].style.display = "inline-block";
		});
	})		

}

editListEl();
addListEl();