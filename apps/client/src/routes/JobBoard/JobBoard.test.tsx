import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import JobBoard from "./JobBoard";
import { render } from "../../test-utils";
import { createMockServer } from "../../test-utils/mockServer";

const mockServer = createMockServer();

describe("JobBoard", () => {
  beforeAll(() => mockServer.listen({ onUnhandledRequest: "error" }));
  afterEach(() => mockServer.resetHandlers());
  afterAll(() => mockServer.close());

  it("shows the job title in the job card", async () => {
    mockServer.addMocks({
      Job: () => ({
        id: "1",
        title: "Software Engineer",
        location: "London",
        type: "FULL_TIME",
        remote: true,
        salary: 100000,
        company: { id: "c1", name: "Acme Corp" },
        createdAt: new Date().toISOString(),
        isApplied: false,
      }),
      Query: {
        searchJobs: () => [{}],
      },
    });

    render(<JobBoard />);

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });
  });

  it("applies for a job", async () => {
    const applyForJobMock = jest.fn();

    mockServer.addMocks({
      Job: () => ({
        id: "1",
        title: "Software Engineer",
        location: "London",
        type: "FULL_TIME",
        remote: true,
        salary: 100000,
        company: { id: "c1", name: "Acme Corp" },
        createdAt: new Date().toISOString(),
        isApplied: false,
      }),
      Query: {
        searchJobs: () => [{}],
      },
      Mutation: {
        applyForJob: (args: { input: { id: string } }) => {
          applyForJobMock(args);
          return true;
        },
      },
    });

    render(<JobBoard />);

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });

    // Click the apply button in the job card
    const applyButton = await screen.findByText("Apply");
    fireEvent.click(applyButton);

    // Click the apply button in the modal
    const dialog = await screen.findByRole("dialog");
    const applyButtonInModal = within(dialog).getByText("Apply");
    fireEvent.click(applyButtonInModal);

    await waitFor(() => {
      expect(applyForJobMock).toHaveBeenCalledWith({
        input: {
          id: "1",
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByText("Awaiting response")).toBeInTheDocument();
    });
  });
});
