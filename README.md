# Remote Library Server 📚

A high-performance, lightweight web server designed to stream educational content from resource-constrained devices like the **Raspberry Pi**. Built with TypeScript and Node.js.

## Quick Links
* **Docker Hub:** [View Image on Docker Hub](https://hub.docker.com/r/shalinidhar/remote_library)
---

## Technical Highlights

* **Custom HTTP Engine:** Built using the native `node:http` module to minimize overhead and avoid the "abstraction tax" of heavy frameworks like Express.
* **Memory-Efficient Streaming:** Implements Node.js `ReadStreams` to serve large PDF assets. This ensures a constant memory footprint (O(1) space complexity), allowing the server to run on devices with as little as 512MB RAM.
* **High-Speed Search:** Integrated **SQLite FTS5 (Full-Text Search)** for sub-10ms indexing and retrieval of document metadata.
* **Containerized Workflow:** Fully Dockerized with multi-platform support, ensuring seamless deployment across development environments and ARM-based edge hardware.

---

## Deployment with Docker

You can pull and run the pre-configured image directly from Docker Hub:

```bash
# Pull the latest image
docker pull shalinidhar/remote_library:v1.0

# Run the server on port 1234
docker run -d -p 1234:1234 --name library-server shalinidhar/remote_library:v1.0