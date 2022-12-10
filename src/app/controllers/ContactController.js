const ContactsRepository = require('../repositories/ContactsRepository')

class ContactController {
	async index(request, response) {
		const { orderBy } = request.query
		const contacts = await ContactsRepository.findAll(orderBy)
		response.json(contacts)
	}

	async show(request, response) {
		const { id } = request.params
		const contact = await ContactsRepository.findById(id)

		if (!contact) {
			return response.status(404).json({ error: 'User not found' })
		}

		response.json(contact)
	}

	async store(request, response) {
		const { name, email, phone, category_id } = request.body

		if (!name || !email) {
			return response.status(400).json({
				error:
					'Please provider a name and email for the register a new contact',
			})
		}

		const contactAlreadyExists = await ContactsRepository.findByEmail(email)

		if (contactAlreadyExists) {
			return response
				.status(400)
				.json({ error: 'This e-mail is already in use' })
		}

		const contact = await ContactsRepository.create({
			name,
			email,
			phone,
			category_id,
		})

		response.status(201).json(contact)
	}

	async update(request, response) {
		const { id } = request.params
		const { name, email, phone, category_id } = request.body

		const contactExists = await ContactsRepository.findById(id)

		const contactByEmailAlreadyExists = await ContactsRepository.findByEmail(
			email
		)

		if (!contactExists) {
			return response.status(400).json({ error: 'User not found' })
		}

		if (!name) {
			return response.status(400).json({
				error: 'Name is required',
			})
		}

		if (contactByEmailAlreadyExists && contactByEmailAlreadyExists.id !== id) {
			return response
				.status(400)
				.json({ error: 'This e-mail is already in use' })
		}

		const contactUpdated = await ContactsRepository.update(id, {
			name,
			email,
			phone,
			category_id,
		})

		response.status(200).json(contactUpdated)
	}

	async delete(request, response) {
		const { id } = request.params
		await ContactsRepository.delete(id)
		response.sendStatus(204)
	}
}

module.exports = new ContactController()
