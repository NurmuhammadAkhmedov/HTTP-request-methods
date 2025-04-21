const addForm = document.querySelector('#add__form');
const nameInput = document.querySelector('#name__input');
const numberInput = document.querySelector('#number__input');
const contactList = document.querySelector('#contact__list');

// Mock API URL (o‘zingizning Mock API endpoint'ingiz bilan almashtiring)
const API_URL = 'https://68038d9b0a99cb7408ec5706.mockapi.io/user/User';

// Kontaktlarni olish va ko‘rsatish (GET)
async function fetchContacts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch contacts');
        const contacts = await response.json();
        contactList.innerHTML = ''; // Ro‘yxatni tozalash
        contacts.forEach(contact => renderContact(contact));
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

// Kontaktni UI da ko‘rsatish
function renderContact(contact) {
    const listItem = document.createElement('li');
    listItem.classList.add('w-full', 'py-[16px]', 'border-b-[2px]', 'border-[#6C63FF]', 'flex', 'items-center', 'justify-between');
    listItem.innerHTML = `
        <div class="flex items-center">
            <img src="${contact.avatar}" alt="Profile" class="w-[40px] h-[40px] rounded-full mr-[10px]">
            <div>
                <p class="text-[20px]">${contact.name}</p>
                <p class="text-[16px] text-gray-500">${contact.number}</p>
            </div>
        </div>
        <div class="flex items-center">
            <img src="./images/Vector.svg" alt="Edit" class="w-[20px] h-[20px] edit cursor-pointer mr-[10px]">
            <img src="./images/trash-svgrepo-com 1.svg" alt="Delete" class="w-[20px] h-[20px] trash cursor-pointer">
        </div>
    `;
    listItem.dataset.id = contact.id; // Kontakt ID sini saqlash
    contactList.appendChild(listItem);
}

// Yangi kontakt qo‘shish (POST)
async function addContact(name, number) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, number }),
        });
        if (!response.ok) throw new Error('Failed to add contact');
        const newContact = await response.json();
        renderContact(newContact); // Yangi kontaktni UI ga qo‘shish
    } catch (error) {
        console.error('Error adding contact:', error);
    }
}

// Form submit qilish
addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const number = numberInput.value.trim();

    if (name && number) {
        addContact(name, number);
        nameInput.value = '';
        numberInput.value = '';
    } else {
        alert('Please fill in both fields!');
    }
});

// Edit va Delete funksiyalari
contactList.addEventListener('click', async (e) => {
    const target = e.target;
    const listItem = target.closest('li');
    const contactId = listItem.dataset.id;

    if (target.classList.contains('trash')) {
        // Kontaktni o‘chirish (DELETE)
        try {
            const response = await fetch(`${API_URL}/${contactId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete contact');
            listItem.remove(); // UI dan o‘chirish
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    }

    if (target.classList.contains('edit')) {
        // Kontaktni tahrirlash uchun formaga ma'lumotlarni yuklash
        const name = listItem.querySelector('p').textContent;
        const number = listItem.querySelectorAll('p')[1].textContent;
        nameInput.value = name;
        numberInput.value = number;

        // Eski kontaktni o‘chirish
        try {
            const response = await fetch(`${API_URL}/${contactId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete contact for editing');
            listItem.remove();
        } catch (error) {
            console.error('Error editing contact:', error);
        }
    }
});

// Sahifa yuklanganda kontaktlarni olish
fetchContacts();