import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
	try {
		const { method, url, headers, body } = await req.json();

		if (!url) {
			return NextResponse.json({ error: "URL is required" }, { status: 400 });
		}

		const startTime = Date.now();

		try {
			const response = await axios({
				method,
				url,
				headers: headers.reduce((acc: any, h: any) => {
					if (h.enabled && h.key) {
						acc[h.key] = h.value;
					}
					return acc;
				}, {}),
				data: body ? (typeof body === "string" ? JSON.parse(body) : body) : undefined,
				validateStatus: () => true, // Don't throw on error status codes
				responseType: "text", // Get raw text to handle any format correctly
			});

			const endTime = Date.now();
			const duration = endTime - startTime;

			return NextResponse.json({
				status: response.status,
				statusText: response.statusText,
				body: response.data,
				headers: response.headers,
				time: duration,
				size: (JSON.stringify(response.data).length / 1024).toFixed(2) + " KB",
			});
		} catch (axiosError: any) {
			console.error("Axios Proxy Error:", axiosError);
			return NextResponse.json(
				{
					error: axiosError.message,
					status: axiosError.response?.status || 500,
					body: axiosError.response?.data || "Internal Proxy Error",
				},
				{ status: 200 } // We return 200 so the frontend gets the structured error
			);
		}
	} catch (error: any) {
		console.error("Proxy handler error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
