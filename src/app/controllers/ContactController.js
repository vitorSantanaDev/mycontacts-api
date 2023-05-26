const ContactsRepository = require('../repositories/ContactsRepository')
const isValidUUID = require('../utils/isValidUUID')

class ContactController {
	async index(request, response) {
		const { orderBy } = request.query
		const contacts = await ContactsRepository.findAll(orderBy)
		response.json(contacts)
	}

	async show(request, response) {
		const { id } = request.params

		if (!isValidUUID(id)) {
			return response.status(400).json({ error: 'Invalid contact ID' })
		}

		const contact = await ContactsRepository.findById(id)

		if (!contact) {
			return response.status(404).json({ error: 'Contact not found' })
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

		if (category_id && !isValidUUID(category_id)) {
			return response.status(400).json({ error: 'Invalid category ID' })
		}

		if (email) {
			const contactAlreadyExists = await ContactsRepository.findByEmail(email)

			if (contactAlreadyExists) {
				return response
					.status(400)
					.json({ error: 'This e-mail is already in use' })
			}
		}

		const contact = await ContactsRepository.create({
			name,
			phone,
			email: email || null,
			category_id: category_id || null,
		})

		response.status(201).json(contact)
	}

	async update(request, response) {
		const { id } = request.params

		if (!isValidUUID(id)) {
			return response.status(400).json({ error: 'Invalid contact ID' })
		}

		const { name, email, phone, category_id } = request.body

		if (category_id && !isValidUUID(category_id)) {
			return response.status(400).json({ error: 'Invalid category ID' })
		}

		if (!name) {
			return response.status(400).json({
				error: 'Name is required',
			})
		}

		const contactExists = await ContactsRepository.findById(id)

		if (!contactExists) {
			return response.status(400).json({ error: 'Contact not found' })
		}

		if (email) {
			const contactByEmailAlreadyExists = await ContactsRepository.findByEmail(
				email
			)

			if (
				contactByEmailAlreadyExists &&
				contactByEmailAlreadyExists.id !== id
			) {
				return response
					.status(400)
					.json({ error: 'This e-mail is already in use' })
			}
		}

		const contactUpdated = await ContactsRepository.update(id, {
			name,
			phone,
			email: email || null,
			category_id: category_id || null,
		})

		response.status(200).json(contactUpdated)
	}

	async delete(request, response) {
		const { id } = request.params

		if (!isValidUUID(id)) {
			return response.status(400).json({ error: 'Invalid contact ID' })
		}

		await ContactsRepository.delete(id)
		response.sendStatus(204)
	}
}

module.exports = new ContactController()
