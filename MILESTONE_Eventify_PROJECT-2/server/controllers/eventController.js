import Event from '../models/Event.js';

export const getEvents = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    
    // Example price filtering based on ticketTiers
    // This is simplified; a real complex query might aggregate or filter subdocuments
    let priceFilter = {};
    if (req.query.maxPrice) {
       priceFilter = { 'ticketTiers.price': { $lte: Number(req.query.maxPrice) } };
    }

    const count = await Event.countDocuments({ ...keyword, ...category, ...priceFilter });
    const events = await Event.find({ ...keyword, ...category, ...priceFilter })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ events, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = new Event({
      title: req.body.title || 'Sample Event',
      description: req.body.description || 'Sample Description',
      date: req.body.date || new Date(),
      location: req.body.location || 'Sample Location',
      image: req.body.image,
      category: req.body.category || 'Other',
      ticketTiers: req.body.ticketTiers || [],
      createdBy: req.user._id,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, image, category, ticketTiers, status } = req.body;

    const event = await Event.findById(req.params.id);

    if (event) {
      event.title = title || event.title;
      event.description = description || event.description;
      event.date = date || event.date;
      event.location = location || event.location;
      event.image = image || event.image;
      event.category = category || event.category;
      event.ticketTiers = ticketTiers || event.ticketTiers;
      event.status = status || event.status;

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
